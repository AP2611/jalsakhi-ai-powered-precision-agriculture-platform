"""
Unified FastAPI serving all ML models on one server.
- /crop-water/*   → Crop Water Requirement (Model 1)
- /soil-moisture/* → Soil Moisture prediction (Model 2)
- /village/*      → Village Water Allocation (Model 3)

Run from repo root or from "ML models":
  cd "ML models" && uvicorn unified_api.main:app --host 0.0.0.0 --port 8000

Works with ngrok: forward to the same host:port; internal calls use 127.0.0.1.
"""
import logging
import os
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

logger = logging.getLogger(__name__)

# Ensure we can import Crop_Water_Model, soil_moisture_model, village_water_allocation, Chatbot.
# soil_moisture_model.api uses same-dir imports (features, predict), so that package dir must be on path.
ML_MODELS_DIR = Path(__file__).resolve().parent.parent
CHATBOT_DIR = ML_MODELS_DIR.parent / "Chatbot"
for path in (str(ML_MODELS_DIR / "soil_moisture_model"), str(ML_MODELS_DIR), str(CHATBOT_DIR)):
    if path not in sys.path:
        sys.path.insert(0, path)

# Import sub-apps after path is set (their Path(__file__) and imports stay correct)
import Crop_Water_Model.main as crop_water_main
import soil_moisture_model.api as soil_moisture_api
import soil_moisture_model.predict as soil_predict
import village_water_allocation.api as village_api
try:
    import api as chatbot_api
    import ml_tools as chatbot_tools
    HAS_CHATBOT = True
except ImportError as e:
    logger.warning("Chatbot service disabled: %s. Run 'pip install -r techathon2k26/Chatbot/requirement.txt' with --break-system-packages if needed.", e)
    HAS_CHATBOT = False


def _load_all_artifacts() -> None:
    """Load all model artifacts so mounted sub-apps can serve requests."""
    # Crop Water (Model 1)
    try:
        crop_water_main.load_artifacts()
        logger.info("Crop Water Model artifacts loaded")
    except Exception as e:
        logger.warning("Crop Water Model not loaded: %s", e)

    # Soil Moisture (Model 2)
    try:
        soil_predict._load_sensor_artifacts()
        logger.info("Soil Moisture sensor model loaded")
    except FileNotFoundError as e:
        logger.warning("Soil Moisture sensor model not loaded: %s", e)
    try:
        soil_predict._load_location_artifacts()
        logger.info("Soil Moisture location model loaded")
    except FileNotFoundError as e:
        logger.warning("Soil Moisture location model not loaded: %s", e)

    # Village (Model 3): load config and point to this server’s /crop-water and /soil-moisture
    village_api.load_config()
    port = os.environ.get("PORT", "8000")
    base = f"http://127.0.0.1:{port}"
    village_api.config["crop_water_api_url"] = f"{base}/crop-water"
    village_api.config["soil_moisture_api_url"] = f"{base}/soil-moisture"
    logger.info("Village Water Allocation config set to use unified API at %s", base)

    # Chatbot (Model 4): point tools to this server's local endpoints
    os.environ["CROP_WATER_API_URL"] = f"{base}/crop-water"
    os.environ["SOIL_MOISTURE_API_URL"] = f"{base}/soil-moisture"
    os.environ["VILLAGE_WATER_API_URL"] = f"{base}/village"
    logger.info("Chatbot tools configured to use internal endpoints at %s", base)


@asynccontextmanager
async def lifespan(app: FastAPI):
    _load_all_artifacts()
    yield


app = FastAPI(
    title="Jalsakhi ML Models API",
    description="Unified API: Crop Water, Soil Moisture, Village Water Allocation.",
    version="1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, Any]:
    """Root: list available services (for ngrok and health checks)."""
    return {
        "service": "Jalsakhi ML Models API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "crop_water": "/crop-water (health, config, predict)",
            "soil_moisture": "/soil-moisture (health, predict, predict/sensor, predict/location)",
            "village": "/village (health, optimize, UI at /village/)",
        },
    }


@app.get("/health")
def health() -> dict[str, Any]:
    """Aggregated health for load balancers and ngrok."""
    crop_ok = crop_water_main.model_pipeline is not None
    soil_sensor = soil_predict._model_sensor is not None
    soil_location = soil_predict._model_location is not None
    return {
        "status": "ok",
        "models": {
            "crop_water": crop_ok,
            "soil_moisture_sensor": soil_sensor,
            "soil_moisture_location": soil_location,
        },
    }


# Mount sub-apps so their routes and static files work under a prefix.
# No code changes in the three model packages; they keep their own routes and behavior.
app.mount("/crop-water", crop_water_main.app)
app.mount("/soil-moisture", soil_moisture_api.app)
app.mount("/village", village_api.app)
if HAS_CHATBOT:
    app.mount("/chatbot", chatbot_api.app)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
