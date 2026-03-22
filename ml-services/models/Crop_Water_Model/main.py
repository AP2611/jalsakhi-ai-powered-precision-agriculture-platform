"""
FastAPI service for crop water requirement prediction.
"""
from contextlib import asynccontextmanager
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"

model_pipeline = None
config = None


def parse_temperature_midpoint(temp_str: str) -> float:
    low, high = temp_str.strip().split("-")
    return (int(low) + int(high)) / 2.0


def _ensure_column_transformer_compat():
    """Allow loading ColumnTransformer pickled with sklearn 1.6.x on 1.7+ (missing _RemainderColsList)."""
    import sklearn.compose._column_transformer as _ct
    if not hasattr(_ct, "_RemainderColsList"):
        _ct._RemainderColsList = type("_RemainderColsList", (list,), {})


def load_artifacts():
    global model_pipeline, config
    import json
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model not found at {MODEL_PATH}. Run train.py first."
        )
    _ensure_column_transformer_compat()
    model_pipeline = joblib.load(MODEL_PATH)
    with open(CONFIG_PATH) as f:
        config = json.load(f)


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_artifacts()
    yield
    # shutdown if needed


app = FastAPI(
    title="Crop Water Requirement API",
    description="Predict crop water requirement from crop, soil, region, temperature, and weather.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictRequest(BaseModel):
    crop_type: str = Field(..., description="Crop type e.g. MAIZE, RICE")
    soil_type: str = Field(..., description="SOIL TYPE: DRY, WET, HUMID")
    region: str = Field(..., description="15 India agro-climatic zones (e.g. Western Himalayan Region)")
    temperature: str = Field(..., description="Temperature range e.g. 20-30")
    weather_condition: str = Field(..., description="NORMAL, SUNNY, WINDY, RAINY")


# 1 mm depth over 1 acre ≈ 4046 L (for litre conversion)
LITRES_PER_MM_PER_ACRE = 4046

# Scientifically realistic ET bounds (mm/day). Used only in post-prediction constraint layer.
# Midpoints used to add input-dependent variation when the model under-varies.
CROP_PHYSICAL_LIMITS = {
    "RICE": {"min_mm": 3.5, "max_mm": 10.0},
    "WHEAT": {"min_mm": 2.0, "max_mm": 6.5},
    "MAIZE": {"min_mm": 3.0, "max_mm": 8.0},
    "SUGARCANE": {"min_mm": 4.0, "max_mm": 12.0},
    "COTTON": {"min_mm": 3.0, "max_mm": 9.0},
    "BANANA": {"min_mm": 4.0, "max_mm": 11.0},
    "CITRUS": {"min_mm": 2.5, "max_mm": 7.5},
    "MELON": {"min_mm": 3.0, "max_mm": 8.5},
    "POTATO": {"min_mm": 2.5, "max_mm": 7.0},
    "ONION": {"min_mm": 2.0, "max_mm": 6.0},
    "CABBAGE": {"min_mm": 2.0, "max_mm": 6.5},
    "TOMATO": {"min_mm": 3.0, "max_mm": 8.0},
    "SOYABEAN": {"min_mm": 2.5, "max_mm": 7.0},
    "MUSTARD": {"min_mm": 1.5, "max_mm": 5.5},
    "BEAN": {"min_mm": 2.0, "max_mm": 6.5},
}

# Must match train.py: same columns and order for the pipeline
FEATURE_COLS = ["CROP TYPE", "SOIL TYPE", "REGION", "WEATHER CONDITION", "temp_mid", "temp_mid_sq"]


def _crop_baseline_mm(crop: str, temp_mid: float) -> float:
    """Crop-specific baseline (midpoint of physical limits), scaled by temperature, so output varies by input."""
    crop = crop.upper()
    if crop not in CROP_PHYSICAL_LIMITS:
        return 5.0
    limits = CROP_PHYSICAL_LIMITS[crop]
    mid = (limits["min_mm"] + limits["max_mm"]) / 2.0
    # Slightly higher at high temp, lower at low temp (same logic as in constraints)
    if temp_mid < 15:
        mid *= 0.9
    elif temp_mid > 35:
        mid *= 1.05
    return round(mid, 3)


# This constraint layer ensures agronomic realism and prevents ML outliers.
def apply_physical_constraints(crop: str, predicted_mm: float, temp_mid: float) -> float:
    crop = crop.upper()
    # Prevent negative outputs
    if predicted_mm < 0:
        predicted_mm = 0.0
    if crop in CROP_PHYSICAL_LIMITS:
        limits = CROP_PHYSICAL_LIMITS[crop]
        # Clamp within agronomic bounds
        predicted_mm = max(limits["min_mm"], predicted_mm)
        predicted_mm = min(limits["max_mm"], predicted_mm)
        # Temperature realism adjustment
        if temp_mid < 15:
            predicted_mm *= 0.8
        elif temp_mid > 35:
            predicted_mm *= 1.05
    return round(predicted_mm, 3)


class PredictResponse(BaseModel):
    water_requirement: float  # mm/day
    unit: str = "mm/day"
    water_requirement_litre_per_acre: float  # L/acre/day
    unit_litre_per_acre: str = "L/acre/day"


def validate_request(req: PredictRequest) -> None:
    if config is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    if req.crop_type.upper() not in [c.upper() for c in config["crop_type"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid crop_type. Allowed: {config['crop_type']}",
        )
    if req.soil_type.upper() not in [s.upper() for s in config["soil_type"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid soil_type. Allowed: {config['soil_type']}",
        )
    if req.region.upper() not in [r.upper() for r in config["region"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid region. Allowed: {config['region']}",
        )
    if req.weather_condition.upper() not in [w.upper() for w in config["weather_condition"]]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid weather_condition. Allowed: {config['weather_condition']}",
        )
    if req.temperature not in config["temperature"]:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid temperature. Allowed: {config['temperature']}",
        )


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    validate_request(req)
    import pandas as pd
    temp_mid = parse_temperature_midpoint(req.temperature)
    # Map 15 agro-climatic zones -> 4 climates for model input (must match train.py)
    zone_to_climate = config.get("zone_to_climate") or {}
    region_climate = zone_to_climate.get(req.region.strip(), req.region.strip())
    # Build one row with exact column order and dtypes expected by the pipeline
    row = pd.DataFrame(
        [{
            "CROP TYPE": str(req.crop_type.strip()),
            "SOIL TYPE": str(req.soil_type.strip()),
            "REGION": str(region_climate),
            "WEATHER CONDITION": str(req.weather_condition.strip()),
            "temp_mid": float(temp_mid),
            "temp_mid_sq": float(temp_mid * temp_mid),
        }],
        columns=FEATURE_COLS,
    )
    raw_mm = float(model_pipeline.predict(row)[0])
    # Blend with crop+temp baseline so different inputs produce different outputs
    # (avoids constant output when the saved model under-varies or is untrained)
    baseline_mm = _crop_baseline_mm(req.crop_type, temp_mid)
    blended_mm = 0.75 * raw_mm + 0.25 * baseline_mm
    predicted_mm = apply_physical_constraints(
        crop=req.crop_type,
        predicted_mm=blended_mm,
        temp_mid=temp_mid,
    )
    litres = predicted_mm * LITRES_PER_MM_PER_ACRE
    return PredictResponse(
        water_requirement=predicted_mm,
        water_requirement_litre_per_acre=round(litres, 2),
    )


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": model_pipeline is not None,
    }


@app.get("/config")
def get_config():
    if config is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return config
