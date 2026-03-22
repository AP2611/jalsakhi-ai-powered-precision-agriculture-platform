# Unified ML Models API

Single FastAPI server that serves all three ML models. Safe to use with **ngrok** for access from other devices.

## Endpoints

| Path | Service | Notes |
|------|---------|--------|
| `/` | Info | Service description and endpoint list |
| `/health` | Health | Aggregated status for all models |
| `/docs` | Swagger | Main API docs (root routes only) |
| `/crop-water/*` | Crop Water (Model 1) | `/crop-water/health`, `/crop-water/predict`, `/crop-water/config` |
| `/soil-moisture/*` | Soil Moisture (Model 2) | `/soil-moisture/health`, `/soil-moisture/predict`, etc. |
| `/village/*` | Village Water Allocation (Model 3) | `/village/health`, `/village/optimize`, UI at `/village/` |

Sub-app docs when mounted: `/crop-water/docs`, `/soil-moisture/docs`, `/village/docs`.

## Run locally

From the **`ML models`** directory (parent of `unified_api`):

```bash
cd "ML models"
pip install -r unified_api/requirements.txt
uvicorn unified_api.main:app --host 0.0.0.0 --port 8000
```

Or with a custom port (set `PORT` so the village optimizer can call crop-water/soil-moisture on the same server):

```bash
PORT=8080 uvicorn unified_api.main:app --host 0.0.0.0 --port 8080
```

## Run with ngrok (access from another device)

1. Start the unified API (e.g. on port 8000).
2. In another terminal, start ngrok:
   ```bash
   ngrok http 8000
   ```
3. Use the ngrok URL (e.g. `https://xxxx.ngrok-free.dev`) on your phone or another computer:
   - **Health:** `https://xxxx.ngrok-free.dev/health`
   - **Crop Water:** `https://xxxx.ngrok-free.dev/crop-water/docs` or POST `https://xxxx.ngrok-free.dev/crop-water/predict`
   - **Soil Moisture:** `https://xxxx.ngrok-free.dev/soil-moisture/docs`
   - **Village UI:** `https://xxxx.ngrok-free.dev/village/`

Internal calls from the Village optimizer to Crop Water and Soil Moisture stay on `127.0.0.1`, so they do not go through ngrok and remain fast and reliable.

## Requirements

- Trained artifacts in place:
  - **Crop_Water_Model:** `model.joblib` and `config.json` (run `train.py` there if missing).
  - **soil_moisture_model:** sensor/location model files (run `train.py` there if missing).
- **scikit-learn 1.6.x** is required for the Crop Water model to load (pickle compatibility). If Crop Water fails with “Model not loaded” or `_RemainderColsList` errors, run: `pip install 'scikit-learn>=1.6.0,<1.7'`.
- No changes required to the three model packages; they are mounted as sub-apps.
