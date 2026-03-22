"""
Feature engineering for sensor-based (soil-moisture.csv) and location-based (NRSC) models.
"""
from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler

# Default number of lag days and forecast horizons
SENSOR_LAGS = 2
FORECAST_DAYS = [3, 4, 5, 6, 7]
NRSC_LAGS = 7
MIN_ROWS_PER_LOCATION = 14

SENSOR_FEATURE_COLS = [
    "avg_pm1", "avg_pm2", "avg_pm3", "avg_am", "avg_lum",
    "avg_temp", "avg_humd", "avg_pres"
]


def _base_dir() -> Path:
    return Path(__file__).resolve().parent


def load_soil_moisture_csv(path: Path | None = None) -> pd.DataFrame:
    """Load and order soil-moisture.csv by time (row order is already chronological)."""
    path = path or _base_dir() / "soil-moisture.csv"
    df = pd.read_csv(path)
    df = df.dropna(how="all")
    return df.reset_index(drop=True)


def build_sensor_features_and_targets(
    df: pd.DataFrame | None = None,
    use_lags: bool = True,
    n_lags: int = SENSOR_LAGS,
) -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    """
    Build sensor feature matrix and multi-output targets (day 3..7).
    Returns (X, Y, aux) where aux has 'scaler_target' (MinMaxScaler fit on targets) and optional 'scaler_features'.
    """
    if df is None:
        df = load_soil_moisture_csv()
    df = df.copy()

    # Targets: shift avg_sm by 3, 4, 5, 6, 7
    for d in FORECAST_DAYS:
        df[f"sm_day{d}"] = df["avg_sm"].shift(-d)

    # Drop rows with NaN in any target (last 7 rows)
    df = df.dropna(subset=[f"sm_day{d}" for d in FORECAST_DAYS])

    # Features: sensor cols + optional lags of avg_sm
    feature_cols = list(SENSOR_FEATURE_COLS)
    if use_lags and n_lags >= 1:
        for i in range(1, n_lags + 1):
            df[f"avg_sm_lag{i}"] = df["avg_sm"].shift(i)
            feature_cols.append(f"avg_sm_lag{i}")
        df = df.dropna(subset=[f"avg_sm_lag{i}" for i in range(1, n_lags + 1)])

    X = df[feature_cols].astype(float).values
    Y = df[[f"sm_day{d}" for d in FORECAST_DAYS]].astype(float).values

    # Scale targets to 0-100% for consistent API
    scaler_target = MinMaxScaler(feature_range=(0, 100))
    Y_scaled = scaler_target.fit_transform(Y)

    aux = {
        "scaler_target": scaler_target,
        "feature_cols": feature_cols,
        "forecast_days": list(FORECAST_DAYS),
    }
    return X, Y_scaled, aux


def time_based_split(
    n: int,
    train_ratio: float = 0.7,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
) -> tuple[int, int]:
    """
    Return (train_end, val_end) indices for time-ordered data.
    Train: [0, train_end), Val: [train_end, val_end), Test: [val_end, n).
    """
    assert abs(train_ratio + val_ratio + test_ratio - 1.0) < 1e-9
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))
    return train_end, val_end


def load_nrsc_csv(path: Path | None = None) -> pd.DataFrame:
    """Load NRSC CSV and parse Date."""
    path = path or _base_dir() / "4554a3c8-74e3-4f93-8727-8fd92161e345_b015ac24ddd9ba5d3b11052466085f93.csv"
    df = pd.read_csv(path)
    df["Date"] = pd.to_datetime(df["Date"])
    return df


def build_nrsc_features_and_targets(
    df: pd.DataFrame | None = None,
    min_rows_per_location: int = MIN_ROWS_PER_LOCATION,
    n_lags: int = NRSC_LAGS,
) -> tuple[np.ndarray, np.ndarray, dict[str, Any]]:
    """
    Build location feature matrix (State, District encoded + lag1..lag7 + Month) and targets (day 3..7).
    Per (State, District) we use ordered Date; lag_k = value at t-k (previous k-th observation).
    Returns (X, Y, aux) with encoders and scaler_target.
    """
    if df is None:
        df = load_nrsc_csv()
    df = df.sort_values(["State", "District", "Date"]).reset_index(drop=True)

    # Filter locations with enough rows
    loc_counts = df.groupby(["State", "District"]).size()
    valid_locs = loc_counts[loc_counts >= min_rows_per_location].index.tolist()
    df = df[df.set_index(["State", "District"]).index.isin(valid_locs)].copy()

    rows_X: list[list[Any]] = []
    rows_Y: list[list[float]] = []

    for (state, district), grp in df.groupby(["State", "District"]):
        grp = grp.sort_values("Date").reset_index(drop=True)
        vals = grp["Avg_smlvl_at15cm"].astype(float).values
        months = grp["Month"].astype(int).values
        n = len(vals)
        if n < n_lags + max(FORECAST_DAYS):
            continue
        for i in range(n_lags, n - max(FORECAST_DAYS)):
            lags = [vals[i - k] for k in range(1, n_lags + 1)]
            targets = [vals[i + d] for d in FORECAST_DAYS]
            row = [state, district, *lags, months[i]]
            rows_X.append(row)
            rows_Y.append(targets)

    if not rows_X:
        raise ValueError("No NRSC rows after building lags; try lowering min_rows_per_location or n_lags.")

    # Encode State and District
    encoder_state = LabelEncoder()
    encoder_district = LabelEncoder()
    states = [r[0] for r in rows_X]
    districts = [r[1] for r in rows_X]
    state_enc = encoder_state.fit_transform(states)
    district_enc = encoder_district.fit_transform(districts)

    # Feature matrix: state_enc, district_enc, lag1..lag7, month -> (n_samples, 2 + n_lags + 1)
    lag_matrix = np.array([r[2:2 + n_lags] for r in rows_X])
    month_col = np.array([r[-1] for r in rows_X], dtype=float).reshape(-1, 1)
    X_np = np.hstack([state_enc.reshape(-1, 1), district_enc.reshape(-1, 1), lag_matrix, month_col])
    Y_np = np.array(rows_Y, dtype=float)

    # Scale targets to 0-100 for consistency with sensor model (NRSC is ~0-25 typically)
    scaler_target = MinMaxScaler(feature_range=(0, 100))
    Y_scaled = scaler_target.fit_transform(Y_np)

    aux = {
        "scaler_target": scaler_target,
        "encoder_state": encoder_state,
        "encoder_district": encoder_district,
        "n_lags": n_lags,
        "forecast_days": list(FORECAST_DAYS),
    }
    return X_np, Y_scaled, aux


def get_sensor_feature_names(use_lags: bool = True, n_lags: int = SENSOR_LAGS) -> list[str]:
    """Return list of feature names for sensor model (for validation and API)."""
    names = list(SENSOR_FEATURE_COLS)
    if use_lags:
        names.extend([f"avg_sm_lag{i}" for i in range(1, n_lags + 1)])
    return names
