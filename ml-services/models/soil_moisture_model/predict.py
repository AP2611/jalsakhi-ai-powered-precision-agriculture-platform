"""
Load trained models and predict soil moisture (%) for days 3, 4, 5, 6, 7.
"""
from pathlib import Path
from typing import Any

import numpy as np
import joblib

from features import (
    FORECAST_DAYS,
    get_sensor_feature_names,
    SENSOR_FEATURE_COLS,
    SENSOR_LAGS,
    NRSC_LAGS,
)

# Lazy-loaded singletons
_model_sensor: Any = None
_scaler_sensor_features: Any = None
_scaler_sensor_target: Any = None
_model_location: Any = None
_scaler_location_features: Any = None
_encoder_state: Any = None
_encoder_district: Any = None


def _base_dir() -> Path:
    return Path(__file__).resolve().parent


def _load_sensor_artifacts() -> None:
    global _model_sensor, _scaler_sensor_features, _scaler_sensor_target
    if _model_sensor is not None:
        return
    base = _base_dir()
    path_model = base / "model_sensor.joblib"
    path_sf = base / "scaler_sensor_features.joblib"
    path_st = base / "scaler_sensor_target.joblib"
    if not path_model.exists() or not path_sf.exists() or not path_st.exists():
        raise FileNotFoundError(
            "Sensor model artifacts not found. Run train.py first. "
            f"Expected: {path_model}, {path_sf}, {path_st}"
        )
    _model_sensor = joblib.load(path_model)
    _scaler_sensor_features = joblib.load(path_sf)
    _scaler_sensor_target = joblib.load(path_st)


def _load_location_artifacts() -> None:
    global _model_location, _scaler_location_features, _encoder_state, _encoder_district
    if _model_location is not None:
        return
    base = _base_dir()
    for name in ["model_location.joblib", "scaler_location_features.joblib", "encoder_state.joblib", "encoder_district.joblib"]:
        if not (base / name).exists():
            raise FileNotFoundError(
                f"Location model artifact not found: {base / name}. Run train.py first."
            )
    _model_location = joblib.load(base / "model_location.joblib")
    _scaler_location_features = joblib.load(base / "scaler_location_features.joblib")
    _encoder_state = joblib.load(base / "encoder_state.joblib")
    _encoder_district = joblib.load(base / "encoder_district.joblib")


def predict_sensor(features_dict: dict[str, float]) -> dict[str, float]:
    """
    Predict soil moisture (%) for days 3, 4, 5, 6, 7 from sensor inputs.
    features_dict must contain: avg_pm1, avg_pm2, avg_pm3, avg_am, avg_lum, avg_temp, avg_humd, avg_pres,
    and optionally avg_sm_lag1, avg_sm_lag2.
    """
    _load_sensor_artifacts()
    expected = get_sensor_feature_names(use_lags=True, n_lags=SENSOR_LAGS)
    missing = [k for k in expected if k not in features_dict]
    if missing:
        raise ValueError(f"Missing sensor features: {missing}")

    row = np.array([[features_dict[k] for k in expected]], dtype=float)
    row_scaled = _scaler_sensor_features.transform(row)
    pred = _model_sensor.predict(row_scaled)[0]
    return {f"day_{d}": float(pred[i]) for i, d in enumerate(FORECAST_DAYS)}


def predict_location(
    state: str,
    district: str,
    sm_history: list[float],
    month: int = 1,
) -> dict[str, float]:
    """
    Predict soil moisture (%) for days 3, 4, 5, 6, 7 from location and last 7 observed values.
    sm_history: length 7, most recent last (e.g. [t-7, t-6, ..., t-1] or [oldest, ..., newest]).
    month: 1-12, optional (default 1).
    """
    _load_location_artifacts()
    if len(sm_history) != NRSC_LAGS:
        raise ValueError(f"sm_history must have length {NRSC_LAGS}, got {len(sm_history)}")

    state_enc = _encoder_state.transform([state])[0]
    district_enc = _encoder_district.transform([district])[0]
    month_val = max(1, min(12, int(month)))
    row = np.array([[state_enc, district_enc, *sm_history, month_val]], dtype=float)
    row_scaled = _scaler_location_features.transform(row)
    pred = _model_location.predict(row_scaled)[0]
    return {f"day_{d}": float(pred[i]) for i, d in enumerate(FORECAST_DAYS)}


def predict_ensemble(
    sensor_features: dict[str, float] | None,
    state: str | None,
    district: str | None,
    sm_history: list[float] | None,
    weights: tuple[float, float] = (0.5, 0.5),
) -> dict[str, float]:
    """
    If both sensor and location inputs are provided, return weighted average of both predictions.
    Otherwise return the single available prediction.
    """
    sensor_pred = None
    location_pred = None
    if sensor_features is not None:
        sensor_pred = predict_sensor(sensor_features)
    if state is not None and district is not None and sm_history is not None:
        location_pred = predict_location(state, district, sm_history)

    if sensor_pred is not None and location_pred is not None:
        out = {}
        for d in FORECAST_DAYS:
            k = f"day_{d}"
            out[k] = weights[0] * sensor_pred[k] + weights[1] * location_pred[k]
        return out
    if sensor_pred is not None:
        return sensor_pred
    if location_pred is not None:
        return location_pred
    raise ValueError("Provide either sensor_features or (state, district, sm_history).")
