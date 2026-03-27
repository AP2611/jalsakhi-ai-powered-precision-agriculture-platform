"""
Village-Level Water Allocation Optimization API.
Distributes limited reservoir water across farms using crop water requirement (Model 1),
optional soil moisture (Model 2), and priority-weighted proportional allocation.
"""
import json
import logging
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

CONFIG_PATH = Path(__file__).resolve().parent / "config.json"
# 1 mm over 1 ha = 10,000 L
LITERS_PER_MM_HA = 10_000
HECTARES_PER_ACRE = 0.4047

config: dict[str, str] = {}


def load_config() -> None:
    global config
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH) as f:
            config = json.load(f)
    else:
        config = {
            "crop_water_api_url": "http://localhost:8001",
            "soil_moisture_api_url": "http://localhost:8002",
        }


def priority_weight(score: float) -> float:
    """Map priority_score to weight: 1 -> 1, 2 -> 1.2, 3 -> 1.5."""
    if score <= 1:
        return 1.0
    if score <= 2:
        return 1.2
    return 1.5


# Map UI region names (DESERT, SEMI ARID, etc.) to Crop Water API's 15 agro-climatic zones
REGION_TO_CROP_WATER_ZONE: dict[str, str] = {
    "DESERT": "Western Dry Region",
    "SEMI ARID": "Central Plateau & Hills Region",
    "SEMI HUMID": "Western Himalayan Region",
    "HUMID": "Eastern Himalayan Region",
}


def _crop_water_region(region: str) -> str:
    """Return Crop Water API region string (15 India agro-climatic zones)."""
    key = region.strip().upper()
    return REGION_TO_CROP_WATER_ZONE.get(key, "Western Himalayan Region")


# Crop Water API allows only these exact values (from its config.json)
CROP_WATER_TEMPERATURES = ("10-20", "20-30", "30-40", "40-50")


def _normalize_crop_water_request(
    crop_type: str,
    soil_type: str,
    region: str,
    temperature: str,
    weather_condition: str,
) -> dict[str, str]:
    """Build request payload with values Crop Water API accepts."""
    crop_water_region = _crop_water_region(region)
    # Temperature must match exactly; default to 20-30 if unknown
    temp = temperature.strip() if temperature else "20-30"
    if temp not in CROP_WATER_TEMPERATURES:
        temp = "20-30"
    return {
        "crop_type": crop_type.strip().upper(),
        "soil_type": soil_type.strip().upper(),
        "region": crop_water_region,
        "temperature": temp,
        "weather_condition": weather_condition.strip().upper(),
    }


async def fetch_crop_water_mm_per_day(
    base_url: str,
    crop_type: str,
    soil_type: str,
    region: str,
    temperature: str,
    weather_condition: str,
) -> tuple[float, float]:
    """
    Call Crop Water API (Model 1) to get water requirement in mm/day.
    Returns (mm_per_day, confidence_score).
    """
    payload = _normalize_crop_water_request(
        crop_type, soil_type, region, temperature, weather_condition
    )
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                f"{base_url.rstrip('/')}/predict",
                json=payload,
            )
            if r.status_code != 200:
                logger.warning("Crop Water API returned status %d", r.status_code)
                return 5.0, 0.4  # Default fallback with low confidence
            data = r.json()
            return float(data["water_requirement"]), 0.9
    except Exception as e:
        logger.warning("Failed to fetch from Crop Water API: %s", e)
        return 5.0, 0.2  # Error fallback with very low confidence


class FarmInput(BaseModel):
    farm_id: str = Field(..., description="Unique farm identifier")
    area_ha: float | None = Field(None, description="Area in hectares")
    area_acre: float | None = Field(None, description="Area in acres (used if area_ha not set)")
    crop_type: str = Field(..., description="Crop type e.g. MAIZE, RICE")
    soil_type: str = Field(..., description="DRY, WET, HUMID")
    region: str = Field(..., description="DESERT, SEMI ARID, SEMI HUMID, HUMID")
    temperature: str = Field(..., description="e.g. 20-30")
    weather_condition: str = Field(..., description="NORMAL, SUNNY, WINDY, RAINY")
    priority_score: float = Field(1.0, ge=1, le=3, description="1=low, 2=medium, 3=high")
    crop_water_requirement_mm_per_day: float | None = Field(
        None, description="If set, skip calling Crop Water API"
    )
    predicted_soil_moisture_pct: float | None = Field(
        None, description="Soil moisture % from Model 2 or default 30"
    )
    min_survival_pct: float = Field(30.0, ge=0, le=100, description="Minimum survival water as % of demand")


class OptimizeRequest(BaseModel):
    total_available_water_liters: float = Field(..., gt=0)
    farms: list[FarmInput] = Field(..., min_length=1)


class AllocationItem(BaseModel):
    farm_id: str
    allocated_liters: float
    share_percent: float
    confidence_score: float
    is_survival_only: bool


class PerFarmReportItem(BaseModel):
    farm_id: str
    allocated_liters: float
    demand_liters: float
    deficit_liters: float
    excess_liters: float
    status: str


class OptimizeResponse(BaseModel):
    allocations: list[AllocationItem]
    per_farm_report: list[PerFarmReportItem]
    village_efficiency_score: float
    total_demand_liters: float
    total_allocated_liters: float


def _area_ha(farm: FarmInput) -> float:
    if farm.area_ha is not None and farm.area_ha > 0:
        return farm.area_ha
    if farm.area_acre is not None and farm.area_acre > 0:
        return farm.area_acre * HECTARES_PER_ACRE
    raise ValueError(f"Farm {farm.farm_id}: provide area_ha or area_acre")


def _demand_liters(area_ha: float, mm_per_day: float, soil_moisture_pct: float | None) -> float:
    """Demand in L/day. 1 mm over 1 ha = 10,000 L."""
    demand = area_ha * LITERS_PER_MM_HA * mm_per_day
    if soil_moisture_pct is not None:
        # Wetter soil -> lower effective demand (scale by 1 - moisture/100, min 0.1)
        factor = max(0.1, 1.0 - soil_moisture_pct / 100.0)
        demand *= factor
    return demand


app = FastAPI(
    title="Village Water Allocation API (Optimized)",
    description="Multi-objective optimization for fair village-level water distribution.",
    version="2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).resolve().parent / "static"
if STATIC_DIR.exists():
    app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/")
def root() -> FileResponse:
    """Serve the test UI."""
    index_path = STATIC_DIR / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="Static UI not found")
    return FileResponse(index_path)


@app.on_event("startup")
def startup() -> None:
    load_config()


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "village_water_allocation"}


@app.post("/optimize", response_model=OptimizeResponse)
async def optimize(req: OptimizeRequest) -> OptimizeResponse:
    """Multi-stage water allocation: Survival phase followed by Growth/Efficiency phase."""
    crop_water_url = config.get("crop_water_api_url", "http://localhost:8001")
    total_available = req.total_available_water_liters
    farms = req.farms

    farm_data: list[dict[str, Any]] = []
    total_demand = 0.0

    for farm in farms:
        area_ha = _area_ha(farm)
        confidence = 1.0
        
        mm_per_day = farm.crop_water_requirement_mm_per_day
        if mm_per_day is None:
            mm_per_day, api_conf = await fetch_crop_water_mm_per_day(
                crop_water_url,
                farm.crop_type,
                farm.soil_type,
                farm.region,
                farm.temperature,
                farm.weather_condition,
            )
            confidence *= api_conf
        
        # Soil moisture adjustment
        moisture = farm.predicted_soil_moisture_pct
        if moisture is None:
            moisture = 30.0
            confidence *= 0.8
        
        demand_liters = _demand_liters(area_ha, mm_per_day, moisture)
        weight = priority_weight(farm.priority_score)
        
        survival_liters = (farm.min_survival_pct / 100.0) * demand_liters
        total_demand += demand_liters
        
        farm_data.append({
            "farm_id": farm.farm_id,
            "demand": demand_liters,
            "survival_need": survival_liters,
            "weight": weight,
            "confidence": round(confidence, 2)
        })

    # Phase 1: Survival water allocation
    total_survival_needed = sum(f["survival_need"] for f in farm_data)
    allocations_raw: dict[str, float] = {}
    
    survival_multiplier = 1.0
    if total_available < total_survival_needed:
        # Extreme scarcity: scale down survival water proportionally
        survival_multiplier = total_available / total_survival_needed
    
    water_left = total_available
    for f in farm_data:
        alloc = f["survival_need"] * survival_multiplier
        allocations_raw[f["farm_id"]] = alloc
        water_left -= alloc
    
    water_left = max(0, water_left)

    # Phase 2: Growth water (remaining water after survival)
    gaps = {f["farm_id"]: max(0, f["demand"] - allocations_raw[f["farm_id"]]) for f in farm_data}
    remaining_demand = sum(gaps.values())
    
    if water_left > 0 and remaining_demand > 0:
        if water_left >= remaining_demand:
            # Full satisfaction possible
            for fid in allocations_raw:
                allocations_raw[fid] += gaps[fid]
        else:
            # Weighted distribution for limited growth water
            growth_potential = sum(f["weight"] * gaps[f["farm_id"]] for f in farm_data)
            to_distribute = water_left
            for f in farm_data:
                fid = f["farm_id"]
                if gaps[fid] > 0:
                    bonus = (f["weight"] * gaps[fid] / growth_potential) * to_distribute
                    allocations_raw[fid] += min(bonus, gaps[fid])

    total_allocated = sum(allocations_raw.values())
    village_efficiency = (total_allocated / total_available * 100) if total_available > 0 else 0.0

    allocations_out = []
    per_farm_report = []
    
    for f in farm_data:
        fid = f["farm_id"]
        alloc = allocations_raw[fid]
        demand = f["demand"]
        
        allocations_out.append(AllocationItem(
            farm_id=fid,
            allocated_liters=round(alloc, 2),
            share_percent=round((alloc / total_allocated * 100) if total_allocated > 0 else 0, 2),
            confidence_score=f["confidence"],
            is_survival_only=alloc <= f["survival_need"] and alloc < demand
        ))
        
        status = "met"
        if alloc < f["survival_need"]: status = "critical_deficit"
        elif alloc < demand: status = "growth_deficit"
        
        per_farm_report.append(PerFarmReportItem(
            farm_id=fid,
            allocated_liters=round(alloc, 2),
            demand_liters=round(demand, 2),
            deficit_liters=round(max(0, demand - alloc), 2),
            excess_liters=round(max(0, alloc - demand), 2),
            status=status
        ))

    return OptimizeResponse(
        allocations=allocations_out,
        per_farm_report=per_farm_report,
        village_efficiency_score=round(village_efficiency, 2),
        total_demand_liters=round(total_demand, 2),
        total_allocated_liters=round(total_allocated, 2),
    )


@app.post("/feedback")
async def feedback(data: dict[str, Any]) -> dict[str, str]:
    """Record actual water usage for model tuning."""
    logger.info("Received usage feedback: %s", data)
    # In a real system, this would write to a DB or log for retraining
    return {"status": "recorded"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8003)
