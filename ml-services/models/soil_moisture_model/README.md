# Soil Moisture Prediction API

Production-grade soil moisture prediction for the next 3–7 days using two models: **sensor-based** (soil-moisture.csv) and **location-based** (NRSC CSV). All artifacts live in this folder.

## Train

```bash
cd soil_moisture_model
pip install -r requirements.txt
python train.py
```

Produces: `model_sensor.joblib`, `model_location.joblib`, scalers, encoders, `metrics_sensor.json`, `metrics_location.json`, `metadata.json`.

## Run API and test UI

**Important:** Start the server from inside `soil_moisture_model` so the UI file is found:

```bash
cd soil_moisture_model
uvicorn api:app --host 0.0.0.0 --port 8000
```

Or use the script:

```bash
./soil_moisture_model/run_ui.sh
```

Then open **http://localhost:8000** (or **http://localhost:8000/ui**) in your browser. If you see `{"detail":"Not Found"}`, stop any existing server on that port (e.g. Ctrl+C in the terminal where uvicorn is running, or `lsof -ti:8000 | xargs kill`) and start again from `soil_moisture_model`.

- **Health**: `GET http://<host>:8000/health` → `{"status": "ok", "models": ["sensor", "location"]}`
- **Sensor prediction**: `POST http://<host>:8000/predict/sensor` with JSON body:
  - Required: `avg_pm1`, `avg_pm2`, `avg_pm3`, `avg_am`, `avg_lum`, `avg_temp`, `avg_humd`, `avg_pres`
  - Optional: `avg_sm_lag1`, `avg_sm_lag2`
- **Location prediction**: `POST http://<host>:8000/predict/location` with JSON body:
  - `state`, `district`, `sm_history` (array of 7 floats, most recent last), optional `month` (1–12)
- **Unified**: `POST http://<host>:8000/predict` with either sensor fields or location fields (or both for ensemble).

Response shape: `{"predictions": [float, ...], "days_ahead": [3, 4, 5, 6, 7]}` (soil moisture % for days 3–7).

## Node backend integration

Use `fetch` or `axios` to call the above URLs. CORS is enabled. OpenAPI docs: `GET http://<host>:8000/docs`.
