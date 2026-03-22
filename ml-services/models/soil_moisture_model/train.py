"""
Train sensor-based and location-based soil moisture models with time-based train/val/test splits.
Saves models, scalers, encoders, and metrics under soil_moisture_model/.
"""
import json
from pathlib import Path

import numpy as np
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.multioutput import MultiOutputRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

from features import (
    build_sensor_features_and_targets,
    build_nrsc_features_and_targets,
    time_based_split,
    FORECAST_DAYS,
)

RANDOM_STATE = 42
TRAIN_RATIO = 0.7
VAL_RATIO = 0.15
TEST_RATIO = 0.15


def _base_dir() -> Path:
    return Path(__file__).resolve().parent


def _metrics_per_horizon(y_true: np.ndarray, y_pred: np.ndarray) -> dict:
    """y_true, y_pred shape (n, 5) for days 3,4,5,6,7."""
    out = {}
    for i, d in enumerate(FORECAST_DAYS):
        out[f"day_{d}"] = {
            "mae": float(mean_absolute_error(y_true[:, i], y_pred[:, i])),
            "rmse": float(np.sqrt(mean_squared_error(y_true[:, i], y_pred[:, i]))),
        }
    out["overall"] = {
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
    }
    return out


def main() -> None:
    base = _base_dir()

    # ---- Sensor model ----
    X_s, Y_s, aux_s = build_sensor_features_and_targets(use_lags=True)
    scaler_s_target = aux_s["scaler_target"]

    n_s = len(X_s)
    train_end, val_end = time_based_split(n_s, TRAIN_RATIO, VAL_RATIO, TEST_RATIO)
    X_s_train, X_s_val, X_s_test = X_s[:train_end], X_s[train_end:val_end], X_s[val_end:]
    Y_s_train, Y_s_val, Y_s_test = Y_s[:train_end], Y_s[train_end:val_end], Y_s[val_end:]

    scaler_s_features = MinMaxScaler(feature_range=(0, 1))
    X_s_train_scaled = scaler_s_features.fit_transform(X_s_train)
    X_s_val_scaled = scaler_s_features.transform(X_s_val)
    X_s_test_scaled = scaler_s_features.transform(X_s_test)

    model_sensor = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, max_depth=12)
    )
    model_sensor.fit(X_s_train_scaled, Y_s_train)

    Y_s_test_pred = model_sensor.predict(X_s_test_scaled)
    metrics_sensor = _metrics_per_horizon(Y_s_test, Y_s_test_pred)

    joblib.dump(model_sensor, base / "model_sensor.joblib")
    joblib.dump(scaler_s_features, base / "scaler_sensor_features.joblib")
    joblib.dump(scaler_s_target, base / "scaler_sensor_target.joblib")
    with open(base / "metrics_sensor.json", "w") as f:
        json.dump(metrics_sensor, f, indent=2)

    print("Sensor model: test MAE (overall) =", metrics_sensor["overall"]["mae"])

    # ---- Location model ----
    X_loc, Y_loc, aux_loc = build_nrsc_features_and_targets()
    scaler_loc_target = aux_loc["scaler_target"]
    encoder_state = aux_loc["encoder_state"]
    encoder_district = aux_loc["encoder_district"]

    n_loc = len(X_loc)
    train_end_loc, val_end_loc = time_based_split(n_loc, TRAIN_RATIO, VAL_RATIO, TEST_RATIO)
    X_loc_train = X_loc[:train_end_loc]
    X_loc_val = X_loc[train_end_loc:val_end_loc]
    X_loc_test = X_loc[val_end_loc:]
    Y_loc_train = Y_loc[:train_end_loc]
    Y_loc_val = Y_loc[train_end_loc:val_end_loc]
    Y_loc_test = Y_loc[val_end_loc:]

    scaler_loc_features = MinMaxScaler(feature_range=(0, 1))
    X_loc_train_scaled = scaler_loc_features.fit_transform(X_loc_train)
    X_loc_val_scaled = scaler_loc_features.transform(X_loc_val)
    X_loc_test_scaled = scaler_loc_features.transform(X_loc_test)

    model_location = MultiOutputRegressor(
        RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, max_depth=12)
    )
    model_location.fit(X_loc_train_scaled, Y_loc_train)

    Y_loc_test_pred = model_location.predict(X_loc_test_scaled)
    metrics_location = _metrics_per_horizon(Y_loc_test, Y_loc_test_pred)

    joblib.dump(model_location, base / "model_location.joblib")
    joblib.dump(scaler_loc_features, base / "scaler_location_features.joblib")
    joblib.dump(encoder_state, base / "encoder_state.joblib")
    joblib.dump(encoder_district, base / "encoder_district.joblib")
    with open(base / "metrics_location.json", "w") as f:
        json.dump(metrics_location, f, indent=2)

    print("Location model: test MAE (overall) =", metrics_location["overall"]["mae"])

    # ---- Optional metadata ----
    import datetime
    metadata = {
        "version": "1.0",
        "trained_at": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
        "split_ratios": {"train": TRAIN_RATIO, "val": VAL_RATIO, "test": TEST_RATIO},
        "test_metrics": {
            "sensor": metrics_sensor["overall"],
            "location": metrics_location["overall"],
        },
    }
    with open(base / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2)

    print("Done. Artifacts saved to", base)


if __name__ == "__main__":
    main()
