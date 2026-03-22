"""
FastAPI service for soil moisture predictions (sensor and location models).
Integrates with Node backend / React Native via JSON and CORS.
"""
import logging
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

from features import FORECAST_DAYS, get_sensor_feature_names, SENSOR_LAGS, NRSC_LAGS
import predict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Soil Moisture Prediction API",
    description="Predict soil moisture (%) for the next 3-7 days. Use sensor inputs or location + history.",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Request/Response schemas ----

class SensorPredictRequest(BaseModel):
    avg_pm1: float = Field(..., description="Average PM1")
    avg_pm2: float = Field(..., description="Average PM2")
    avg_pm3: float = Field(..., description="Average PM3")
    avg_am: float = Field(..., description="Average AM")
    avg_lum: float = Field(..., description="Average luminosity")
    avg_temp: float = Field(..., description="Average temperature (C)")
    avg_humd: float = Field(..., description="Average humidity (%)")
    avg_pres: float = Field(..., description="Average pressure (Pa)")
    avg_sm_lag1: float | None = Field(None, description="Soil moisture lag 1 day (optional)")
    avg_sm_lag2: float | None = Field(None, description="Soil moisture lag 2 days (optional)")

    def to_features_dict(self) -> dict[str, float]:
        out = {
            "avg_pm1": self.avg_pm1,
            "avg_pm2": self.avg_pm2,
            "avg_pm3": self.avg_pm3,
            "avg_am": self.avg_am,
            "avg_lum": self.avg_lum,
            "avg_temp": self.avg_temp,
            "avg_humd": self.avg_humd,
            "avg_pres": self.avg_pres,
        }
        expected_lags = get_sensor_feature_names(use_lags=True, n_lags=SENSOR_LAGS)
        for k in expected_lags:
            if k.startswith("avg_sm_lag"):
                # Use provided value or 0 if missing (API may send only sensor cols)
                val = getattr(self, k, None)
                if val is None:
                    val = 0.0
                out[k] = val
        return out


class LocationPredictRequest(BaseModel):
    state: str = Field(..., description="State name (e.g. Rajasthan)")
    district: str = Field(..., description="District name (e.g. Udaipur)")
    sm_history: list[float] = Field(
        ...,
        min_length=NRSC_LAGS,
        max_length=NRSC_LAGS,
        description="Last 7 observed soil moisture values, most recent last",
    )
    month: int = Field(1, ge=1, le=12, description="Month (1-12)")


class PredictResponse(BaseModel):
    predictions: list[float] = Field(..., description="Predicted soil moisture (%) for days 3,4,5,6,7")
    days_ahead: list[int] = Field(default=list(FORECAST_DAYS), description="Forecast horizons in days")


def _predict_response_from_dict(d: dict[str, float]) -> PredictResponse:
    return PredictResponse(
        predictions=[d[f"day_{x}"] for x in FORECAST_DAYS],
        days_ahead=list(FORECAST_DAYS),
    )


# ---- Startup: preload models ----

@app.on_event("startup")
def startup() -> None:
    loaded = []
    try:
        predict._load_sensor_artifacts()
        loaded.append("sensor")
    except FileNotFoundError as e:
        logger.warning("Sensor model not loaded: %s", e)
    try:
        predict._load_location_artifacts()
        loaded.append("location")
    except FileNotFoundError as e:
        logger.warning("Location model not loaded: %s", e)
    if not loaded:
        logger.warning("No models loaded. Run train.py first.")


# ---- Static UI ----

_UI_HTML: str = ""


def _load_ui_html() -> str:
    """Load UI from static/index.html; try module dir then cwd."""
    global _UI_HTML
    if _UI_HTML:
        return _UI_HTML
    import os
    candidates = [
        Path(__file__).resolve().parent / "static" / "index.html",
        Path(os.getcwd()) / "static" / "index.html",
        Path(os.getcwd()) / "soil_moisture_model" / "static" / "index.html",
    ]
    for index in candidates:
        if index.exists():
            _UI_HTML = index.read_text(encoding="utf-8")
            return _UI_HTML
    # Fallback: minimal inline HTML that tells user to run from soil_moisture_model
    _UI_HTML = """<!DOCTYPE html><html><head><title>Soil Moisture API</title></head><body>
    <h1>Soil Moisture Prediction API</h1>
    <p>Test UI file not found. Run from <code>soil_moisture_model</code>: <code>cd soil_moisture_model && uvicorn api:app --port 8000</code></p>
    <p>Endpoints: <a href="/docs">/docs</a> | <a href="/health">/health</a></p>
    </body></html>"""
    return _UI_HTML


@app.on_event("startup")
def _load_ui_on_startup() -> None:
    """Load UI HTML at startup so path resolution uses correct cwd."""
    _load_ui_html()


@app.get("/", response_class=HTMLResponse)
@app.get("/ui", response_class=HTMLResponse)
def serve_ui() -> HTMLResponse:
    """Serve the test UI."""
    return HTMLResponse(content=_load_ui_html(), media_type="text/html")


# ---- Endpoints ----

@app.get("/health")
def health() -> dict[str, Any]:
    """Liveness check for Node backend."""
    loaded = []
    if predict._model_sensor is not None:
        loaded.append("sensor")
    if predict._model_location is not None:
        loaded.append("location")
    return {"status": "ok", "models": loaded}


@app.post("/predict/sensor", response_model=PredictResponse)
def predict_sensor_endpoint(body: SensorPredictRequest) -> PredictResponse:
    """Predict soil moisture (%) for days 3-7 from sensor inputs."""
    try:
        # Ensure lags are present (model expects them)
        features = body.to_features_dict()
        expected = get_sensor_feature_names(use_lags=True, n_lags=SENSOR_LAGS)
        for k in expected:
            if k not in features:
                features[k] = 0.0
        result = predict.predict_sensor(features)
        return _predict_response_from_dict(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Sensor prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed")


@app.post("/predict/location", response_model=PredictResponse)
def predict_location_endpoint(body: LocationPredictRequest) -> PredictResponse:
    """Predict soil moisture (%) for days 3-7 from location and last 7 observed values."""
    try:
        result = predict.predict_location(
            state=body.state,
            district=body.district,
            sm_history=body.sm_history,
            month=body.month,
        )
        return _predict_response_from_dict(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.exception("Location prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed")


class PredictFlexibleBody(BaseModel):
    """Optional sensor and/or location fields. At least one set must be provided."""
    # Sensor
    avg_pm1: float | None = None
    avg_pm2: float | None = None
    avg_pm3: float | None = None
    avg_am: float | None = None
    avg_lum: float | None = None
    avg_temp: float | None = None
    avg_humd: float | None = None
    avg_pres: float | None = None
    avg_sm_lag1: float | None = None
    avg_sm_lag2: float | None = None
    # Location
    state: str | None = None
    district: str | None = None
    sm_history: list[float] | None = None
    month: int = 1

    def has_sensor(self) -> bool:
        return all(
            getattr(self, k) is not None
            for k in ["avg_pm1", "avg_pm2", "avg_pm3", "avg_am", "avg_lum", "avg_temp", "avg_humd", "avg_pres"]
        )

    def has_location(self) -> bool:
        return (
            self.state is not None
            and self.district is not None
            and self.sm_history is not None
            and len(self.sm_history) == NRSC_LAGS
        )


@app.post("/predict", response_model=PredictResponse)
def predict_auto(body: PredictFlexibleBody) -> PredictResponse:
    """
    Predict using sensor and/or location input. If both are provided, returns ensemble (average).
    Send JSON with sensor fields and/or state, district, sm_history.
    """
    if body.has_sensor() and body.has_location():
        try:
            features = {
                "avg_pm1": float(body.avg_pm1),
                "avg_pm2": float(body.avg_pm2),
                "avg_pm3": float(body.avg_pm3),
                "avg_am": float(body.avg_am),
                "avg_lum": float(body.avg_lum),
                "avg_temp": float(body.avg_temp),
                "avg_humd": float(body.avg_humd),
                "avg_pres": float(body.avg_pres),
                "avg_sm_lag1": (body.avg_sm_lag1 if body.avg_sm_lag1 is not None else 0.0),
                "avg_sm_lag2": (body.avg_sm_lag2 if body.avg_sm_lag2 is not None else 0.0),
            }
            result = predict.predict_ensemble(
                sensor_features=features,
                state=str(body.state),
                district=str(body.district),
                sm_history=list(body.sm_history) if body.sm_history else [],
            )
            return _predict_response_from_dict(result)
        except (ValueError, Exception) as e:
            logger.exception("Ensemble prediction failed")
            raise HTTPException(status_code=422 if isinstance(e, ValueError) else 500, detail=str(e))
    if body.has_sensor():
        req = SensorPredictRequest(
            avg_pm1=float(body.avg_pm1),
            avg_pm2=float(body.avg_pm2),
            avg_pm3=float(body.avg_pm3),
            avg_am=float(body.avg_am),
            avg_lum=float(body.avg_lum),
            avg_temp=float(body.avg_temp),
            avg_humd=float(body.avg_humd),
            avg_pres=float(body.avg_pres),
            avg_sm_lag1=body.avg_sm_lag1,
            avg_sm_lag2=body.avg_sm_lag2,
        )
        return predict_sensor_endpoint(req)
    if body.has_location():
        req = LocationPredictRequest(
            state=str(body.state),
            district=str(body.district),
            sm_history=list(body.sm_history),
            month=body.month,
        )
        return predict_location_endpoint(req)
    raise HTTPException(
        status_code=422,
        detail="Provide either sensor fields (avg_pm1, avg_pm2, ...) or location (state, district, sm_history of length 7).",
    )
