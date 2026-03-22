# Crop Water Requirement Model and API

Predicts crop water requirement from crop type, soil type, **15 India agro-climatic zones**, temperature range, and weather condition. Outputs in **mm/day** and **L/acre/day**. Uses a Random Forest model trained on the expanded dataset and exposed via FastAPI.

## Setup

```bash
pip install -r requirements.txt
```

## Data and training

The model uses **15 agro-climatic zones of India** (e.g. Western Himalayan Region, Trans-Gangetic Plain Region, Western Dry Region). The training data is built from the original 4-region dataset:

1. **Expand dataset** (run once to create `DATASET_15_agro_zones.csv`):

```bash
python expand_dataset_agro_zones.py
```

2. **Train the model** to produce `model.joblib` and `config.json`:

```bash
python train.py
```

Use the **same Python environment** for training and running the API so the saved model loads correctly.

If predictions look the same for every input, **retrain** so the model learns from the dataset (which has different water requirements per crop/soil/region/weather/temp). The API also blends the model output with a crop- and temperature-dependent baseline so that different crops and temperatures still produce different values even when the saved model under-varies.

## Run the API

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or:

```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

- **Docs:** http://localhost:8000/docs  
- **Health:** `GET /health`  
- **Predict:** `POST /predict` (see below)

## Predict endpoint

**POST /predict**

Request body (JSON):

| Field             | Description                    | Example    |
|-------------------|--------------------------------|------------|
| `crop_type`       | Crop name                      | `"MAIZE"`  |
| `soil_type`       | DRY, WET, HUMID                | `"DRY"`    |
| `region`          | One of 15 India agro-climatic zones | `"Western Himalayan Region"` |
| `temperature`     | Range as string                | `"20-30"`  |
| `weather_condition` | NORMAL, SUNNY, WINDY, RAINY  | `"SUNNY"`  |

Example:

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"crop_type":"MAIZE","soil_type":"DRY","region":"Trans-Gangetic Plain Region","temperature":"20-30","weather_condition":"SUNNY"}'
```

Response (mm/day and L/acre/day):

```json
{
  "water_requirement": 7.9062,
  "unit": "mm/day",
  "water_requirement_litre_per_acre": 31988.52,
  "unit_litre_per_acre": "L/acre/day"
}
```

**GET /config** returns allowed values for each field (including all 15 regions).

## Test UI (Gradio)

```bash
python app_gradio.py
```

Open the URL shown (e.g. http://127.0.0.1:7860). Pick crop, soil, **agro-climatic zone**, temperature, weather and click **Predict**. Results show both **mm/day** and **L/acre/day**.

## Project layout

- `expand_dataset_agro_zones.py` – Build 15-zone dataset from original 4-region data
- `train.py` – Load data, preprocess, train Random Forest, save pipeline and config
- `main.py` – FastAPI app: `/predict`, `/health`, `/config`
- `app_gradio.py` – Gradio UI for testing predictions
- `model.joblib` – Trained pipeline (created by `train.py`)
- `config.json` – Allowed categories including 15 regions (created by `train.py`)
- `DATASET - Sheet1.csv` – Original training data (4 regions)
- `DATASET_15_agro_zones.csv` – Expanded training data (15 agro-climatic zones)
