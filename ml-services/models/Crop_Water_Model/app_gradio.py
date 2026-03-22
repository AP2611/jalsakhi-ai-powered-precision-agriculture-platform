"""
Basic Gradio UI to test the crop water requirement model.
Run: python app_gradio.py
"""
import json
from pathlib import Path

import gradio as gr
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).resolve().parent / "model.joblib"
CONFIG_PATH = Path(__file__).resolve().parent / "config.json"

# 1 mm depth over 1 acre ≈ 4046.86 L
MM_PER_DAY_TO_LITRE_PER_ACRE = 4046.86

# 15 Agro-Climatic Zones of India (always use this for region dropdown)
AGRO_CLIMATIC_ZONES = [
    "Western Himalayan Region",
    "Eastern Himalayan Region",
    "Lower Gangetic Plain Region",
    "Middle Gangetic Plain Region",
    "Upper Gangetic Plain Region",
    "Trans-Gangetic Plain Region",
    "Eastern Plateau & Hills Region",
    "Central Plateau & Hills Region",
    "Western Plateau & Hills Region",
    "Southern Plateau & Hills Region",
    "East Coast Plains & Hills Region",
    "West Coast Plains & Ghats Region",
    "Gujarat Plains & Hills Region",
    "Western Dry Region",
    "Island Region",
]


def load_artifacts():
    with open(CONFIG_PATH) as f:
        config = json.load(f)
    model = joblib.load(MODEL_PATH)
    return config, model


def parse_temp(s: str) -> float:
    low, high = s.strip().split("-")
    return (int(low) + int(high)) / 2.0


def predict(crop_type, soil_type, region, temperature, weather_condition):
    temp_mid = parse_temp(temperature)
    # Map 15 agro-climatic zones -> 4 climates for model input
    zone_to_climate = config.get("zone_to_climate") or {}
    region_climate = zone_to_climate.get((region or "").strip(), (region or "").strip())
    row = pd.DataFrame(
        [{
            "CROP TYPE": crop_type,
            "SOIL TYPE": soil_type,
            "REGION": region_climate,
            "WEATHER CONDITION": weather_condition,
            "temp_mid": temp_mid,
            "temp_mid_sq": temp_mid * temp_mid,
        }],
        columns=["CROP TYPE", "SOIL TYPE", "REGION", "WEATHER CONDITION", "temp_mid", "temp_mid_sq"],
    )
    pred = model_pipeline.predict(row)[0]
    pred_mm = round(float(pred), 4)
    crop_min = config.get("crop_min_mm") or {}
    pred_mm = max(pred_mm, crop_min.get((crop_type or "").strip().upper(), 0))
    litre_per_acre = round(pred_mm * MM_PER_DAY_TO_LITRE_PER_ACRE, 2)
    return pred_mm, litre_per_acre


if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found. Run: python train.py")
config, model_pipeline = load_artifacts()

with gr.Blocks(title="Crop Water Requirement") as app:
    gr.Markdown("## Crop Water Requirement (test)")
    with gr.Row():
        crop = gr.Dropdown(
            choices=config["crop_type"],
            value=config["crop_type"][0],
            label="Crop type",
        )
        soil = gr.Dropdown(
            choices=config["soil_type"],
            value=config["soil_type"][0],
            label="Soil type",
        )
    with gr.Row():
        region = gr.Dropdown(
            choices=AGRO_CLIMATIC_ZONES,
            value=AGRO_CLIMATIC_ZONES[0],
            label="Agro-climatic zone (India)",
        )
        temp = gr.Dropdown(
            choices=config["temperature"],
            value=config["temperature"][0],
            label="Temperature range",
        )
    weather = gr.Dropdown(
        choices=config["weather_condition"],
        value=config["weather_condition"][0],
        label="Weather condition",
    )
    btn = gr.Button("Predict")
    gr.Markdown("**Output**")
    with gr.Row():
        out_mm = gr.Number(label="mm/day", interactive=False)
        out_litre = gr.Number(label="litre/acre per day", interactive=False)

    btn.click(
        fn=predict,
        inputs=[crop, soil, region, temp, weather],
        outputs=[out_mm, out_litre],
    )

app.launch()
