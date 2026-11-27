
from pathlib import Path

import joblib
import pandas as pd

from ml.preprocessing.prepare_dataset import prepare_daicwoz_split


MODEL_PATH = "ml/artifacts/text_classifier.joblib"
DEV_LABELS = "ml/data/metadata/dev_split_Depression_AVEC2017.csv"
TRANSCRIPTS_DIR = "ml/data/raw"
OUTPUT_PATH = "ml/evaluation/results/dev/prediction_analysis.csv"


def analyze_dev_predictions():
    model = joblib.load(MODEL_PATH)

    df = prepare_daicwoz_split(
        labels_path=DEV_LABELS,
        transcripts_dir=TRANSCRIPTS_DIR,
    )

    if df.empty:
        raise ValueError("No development records available.")

    probabilities = model.predict_proba(df["text"])
    predictions = model.predict(df["text"])

    class_one_index = list(model.classes_).index(1)

    results = pd.DataFrame({
        "actual_label": df["label"],
        "predicted_label": predictions,
        "class_0_probability": probabilities[:, list(model.classes_).index(0)],
        "class_1_probability": probabilities[:, class_one_index],
    })

    results["correct_prediction"] = (
        results["actual_label"] == results["predicted_label"]
    )

    results["prediction_confidence"] = results[
        ["class_0_probability", "class_1_probability"]
    ].max(axis=1)

    summary = results.groupby("actual_label").agg(
        participants=("actual_label", "size"),
        accuracy=("correct_prediction", "mean"),
        mean_class_1_probability=("class_1_probability", "mean"),
        mean_prediction_confidence=("prediction_confidence", "mean"),
    ).reset_index()

    output = Path(OUTPUT_PATH)
    output.parent.mkdir(parents=True, exist_ok=True)
    summary.to_csv(output, index=False)

    print("Development prediction analysis")
    print(summary.round(4).to_string(index=False))

    print("\nSaved:", output)


if __name__ == "__main__":
    analyze_dev_predictions()
