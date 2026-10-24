
from pathlib import Path

# ML project paths
ML_DIR = Path(__file__).resolve().parent
DATA_DIR = ML_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
ARTIFACTS_DIR = ML_DIR / "artifacts"

# Reproducibility
RANDOM_SEED = 42

# Dataset and model settings will be finalized
# after inspecting the approved research dataset.
