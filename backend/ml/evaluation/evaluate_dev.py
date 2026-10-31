
from pathlib import Path

import joblib

from ml.evaluation.evaluate import evaluate_classifier
from ml.preprocessing.prepare_dataset import prepare_daicwoz_split


def evaluate_dev_model(
    model_path="ml/artifacts/text_classifier.joblib",
    labels_path="ml/data/metadata/dev_split_Depression_AVEC2017.csv",
    transcripts_dir="ml/data/raw",
    output_dir="ml/evaluation/results/dev",
):
    model_file = Path(model_path)

    if not model_file.exists():
        raise FileNotFoundError(
            f"Trained model not found: {model_file}. Train the baseline first."
        )

    # Load the official development participants and their labels.
    df = prepare_daicwoz_split(
        labels_path=labels_path,
        transcripts_dir=transcripts_dir,
    )

    if df.empty:
        raise ValueError(
            "No usable development transcripts were found."
        )

    if df["Participant_ID"].duplicated().any():
        raise ValueError("Duplicate participant IDs in development data.")

    # Load the existing model. Do not fit or retrain it here.
    model = joblib.load(model_file)

    X = df["text"]
    y_true = df["label"].tolist()
    y_pred = model.predict(X).tolist()

    results = evaluate_classifier(
        y_true=y_true,
        y_pred=y_pred,
        labels=[0, 1],
        output_dir=output_dir,
    )

    print("Evaluation split: official DAIC-WOZ development")
    print("Development participants evaluated:", len(df))
    print("Participant IDs:", sorted(df["Participant_ID"].tolist()))
    print("Label distribution:")
    print(df["label"].value_counts().sort_index().to_string())
    print("\nMetrics:")
    for metric in (
        "accuracy",
        "macro_precision",
        "macro_recall",
        "macro_f1",
    ):
        print(f"{metric}: {results[metric]:.4f}")

    print("\nConfusion matrix:")
    print(results["confusion_matrix"])
    print("\nClassification report:")
    print(results["classification_report"])
    print("\nResults saved to:", output_dir)

    return results


if __name__ == "__main__":
    evaluate_dev_model()
