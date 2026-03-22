# Test APIs from another PC

Use these commands **from another computer** (or phone with a terminal app). Replace **`YOUR_NGROK_URL`** with your actual ngrok forwarding URL (e.g. `https://picrated-weighted-deeanna.ngrok-free.dev`).

**Required:** On the host machine, run `ngrok http 5000` and use the HTTPS URL it shows. Add the header below so ngrok doesn’t block the request.

---

## 1. Gateway health (no auth)

```bash
curl -s "YOUR_NGROK_URL/health" \
  -H "ngrok-skip-browser-warning: true"
```

Expected: `{"status":"ok"}`

---

## 2. Crop Water API (via gateway)

**Health:**
```bash
curl -s "YOUR_NGROK_URL/crop-water/health" \
  -H "ngrok-skip-browser-warning: true"
```

**Predict:**
```bash
curl -s -X POST "YOUR_NGROK_URL/crop-water/predict" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "crop_type": "RICE",
    "soil_type": "WET",
    "region": "Western Himalayan Region",
    "temperature": "20-30",
    "weather_condition": "NORMAL"
  }'
```

Expected: JSON with `water_requirement`, `water_requirement_litre_per_acre`, etc.

---

## 3. Soil Moisture API (via gateway)

**Health:**
```bash
curl -s "YOUR_NGROK_URL/soil-moisture/health" \
  -H "ngrok-skip-browser-warning: true"
```

**Predict (sensor):**
```bash
curl -s -X POST "YOUR_NGROK_URL/soil-moisture/predict/sensor" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "avg_pm1": 10, "avg_pm2": 20, "avg_pm3": 15,
    "avg_am": 0.5, "avg_lum": 200, "avg_temp": 28,
    "avg_humd": 65, "avg_pres": 101325
  }'
```

**Predict (location):**
```bash
curl -s -X POST "YOUR_NGROK_URL/soil-moisture/predict/location" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "state": "Rajasthan",
    "district": "Udaipur",
    "sm_history": [12, 14, 13, 15, 14, 16, 15],
    "month": 4
  }'
```

Expected: JSON with `predictions` (array) and `days_ahead`.

---

## 4. Village Water API (via gateway)

**Health:**
```bash
curl -s "YOUR_NGROK_URL/village-water/health" \
  -H "ngrok-skip-browser-warning: true"
```

**Optimize:**
```bash
curl -s -X POST "YOUR_NGROK_URL/village-water/optimize" \
  -H "Content-Type: application/json" \
  -H "ngrok-skip-browser-warning: true" \
  -d '{
    "total_available_water_liters": 450000,
    "farms": [
      {
        "farm_id": "1",
        "area_ha": 2,
        "crop_type": "RICE",
        "soil_type": "WET",
        "region": "SEMI HUMID",
        "temperature": "20-30",
        "weather_condition": "NORMAL",
        "priority_score": 3
      },
      {
        "farm_id": "2",
        "area_ha": 1.2,
        "crop_type": "WHEAT",
        "soil_type": "DRY",
        "region": "SEMI ARID",
        "temperature": "20-30",
        "weather_condition": "SUNNY",
        "priority_score": 2
      }
    ]
  }'
```

Expected: JSON with `allocations`, `per_farm_report`, `village_efficiency_score`, etc.

---

## One-liner examples (replace YOUR_NGROK_URL)

```bash
# Gateway health
curl -s "YOUR_NGROK_URL/health" -H "ngrok-skip-browser-warning: true"

# Crop Water predict
curl -s -X POST "YOUR_NGROK_URL/crop-water/predict" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" -d '{"crop_type":"RICE","soil_type":"WET","region":"Western Himalayan Region","temperature":"20-30","weather_condition":"NORMAL"}'

# Village Water optimize
curl -s -X POST "YOUR_NGROK_URL/village-water/optimize" -H "Content-Type: application/json" -H "ngrok-skip-browser-warning: true" -d '{"total_available_water_liters":450000,"farms":[{"farm_id":"1","area_ha":2,"crop_type":"RICE","soil_type":"WET","region":"SEMI HUMID","temperature":"20-30","weather_condition":"NORMAL","priority_score":3}]}'
```
