# Village Water Allocation Optimization API

Distributes limited village reservoir water across farms using:

- **Crop Water Requirement** from [Crop_Water_Model](../Crop_Water_Model) (Model 1)
- Optional **predicted soil moisture** from [soil_moisture_model](../soil_moisture_model) (Model 2) or request field
- Priority-weighted proportional allocation (food/cash or low/medium/high)

## Setup

```bash
cd "ML models/village_water_allocation"
pip install -r requirements.txt
```

Optional: edit `config.json` to set Crop Water and Soil Moisture API base URLs (defaults: 8001, 8002).

## Run

```bash
uvicorn api:app --host 0.0.0.0 --port 8003
```

**Required for live crop-water lookup:** Run the **Crop Water API** (Model 1) on **port 8001**. If port 8001 is running a different service (e.g. Soil Moisture API), you will get `422 Unprocessable Content` when optimizing.

```bash
# In a separate terminal, from repo root:
cd "ML models/Crop_Water_Model"
pip install -r requirements.txt
# Train first if model.joblib is missing: python train.py
uvicorn main:app --host 0.0.0.0 --port 8001
```

Optional: Soil Moisture API can run on 8002. Edit `config.json` if your Crop Water or Soil Moisture APIs use different ports.

## API

- **POST /optimize**

  **Body:** `total_available_water_liters`, `farms` (array of farm objects).

  Each farm: `farm_id`, `area_ha` or `area_acre`, `crop_type`, `soil_type`, `region`, `temperature`, `weather_condition`, `priority_score` (1–3). Optional: `crop_water_requirement_mm_per_day`, `predicted_soil_moisture_pct`.

  **Response:** `allocations` (farm_id, allocated_liters, share_percent), `per_farm_report` (deficit/excess per farm), `village_efficiency_score` (0–100), `total_demand_liters`, `total_allocated_liters`.

- **GET /health** — liveness check.

## Units

- Crop Water API returns **mm/day**. Conversion: 1 mm over 1 ha = 10,000 L → `demand_liters = area_ha * 10000 * mm_per_day`.
- Area: use `area_ha` or `area_acre` (converted with 1 acre = 0.4047 ha).
- High `predicted_soil_moisture_pct` reduces effective demand so wetter soil gets less allocation.
