
# SAHYOG AI — ML Pipeline

## Objective
Develop and evaluate NLP models for research on distress-related language using real, appropriately licensed datasets.

## Pipeline
1. Obtain and verify dataset access and usage permissions.
2. Inspect dataset documentation, labels, and data quality.
3. Split data into training, validation, and test sets without leakage.
4. Preprocess text while preserving meaningful language.
5. Train a baseline model.
6. Evaluate using precision, recall, F1-score, and a confusion matrix.
7. Version the model and document its limitations.
8. Integrate predictions with the FastAPI assessment service.

## Directory Structure
- `data/raw/`: Original permitted research data.
- `data/processed/`: Prepared datasets.
- `preprocessing/`: Text preprocessing utilities.
- `training/`: Model training scripts.
- `evaluation/`: Evaluation scripts.
- `artifacts/`: Locally saved model artifacts.
- `tests/`: Automated pipeline tests.

## Research and Safety
- Do not invent research data or labels.
- Follow the dataset licence and access agreement.
- Keep restricted or sensitive data out of Git.
- Do not treat model outputs as clinical diagnoses.
- Require appropriate human review.
- Report dataset limitations and evaluation results honestly.

## Current Status
- ML folder structure created.
- Basic text normalization implemented.
- Dataset access and selection pending.
- Model training not yet implemented.



## Research Target and Label Selection

The prediction target has not yet been finalized.

Before training:
1. Review the approved dataset's official documentation.
2. Identify the available labels and their definitions.
3. Select a research question supported by those labels.
4. Check participant-level identifiers and prevent data leakage.
5. Define a reproducible training, validation, and test strategy.
6. Document class imbalance, limitations, and evaluation metrics.

No model performance or clinical validity is claimed before
training and evaluation on suitable research data.
