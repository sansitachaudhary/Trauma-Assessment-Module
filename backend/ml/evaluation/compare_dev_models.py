
from pathlib import Path

import joblib
import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    balanced_accuracy_score,
)

from ml.config import RANDOM_SEED
from ml.preprocessing.prepare_dataset import prepare_daicwoz_split


def compare_dev_models():
    train_df = pd.read_csv("ml/data/processed/train_prepared.csv")

    dev_df = prepare_daicwoz_split(
        labels_path="ml/data/metadata/dev_split_Depression_AVEC2017.csv",
        transcripts_dir="ml/data/raw",
    )

    X_train = train_df["text"]
    y_train = train_df["label"].astype(int)

    X_dev = dev_df["text"]
    y_dev = dev_df["label"].astype(int)

    models = {
        "balanced": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
            ("classifier", LogisticRegression(
                max_iter=1000,
                class_weight="balanced",
                random_state=RANDOM_SEED,
            )),
        ]),
        "positive_3": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2))),
            ("classifier", LogisticRegression(
                max_iter=1000,
                class_weight={0: 1, 1: 3},
                random_state=RANDOM_SEED,
            )),
        ]),
    }

    rows = []

    for name, model in models.items():
        model.fit(X_train, y_train)
        predictions = model.predict(X_dev)

        print(f"\nMODEL: {name}")
        print("Confusion matrix:")
        print(confusion_matrix(y_dev, predictions, labels=[0, 1]))
        print(classification_report(
            y_dev,
            predictions,
            labels=[0, 1],
            zero_division=0,
        ))

        rows.append({
            "model": name,
            "accuracy": accuracy_score(y_dev, predictions),
            "macro_f1": f1_score(
                y_dev, predictions, average="macro", zero_division=0
            ),
            "balanced_accuracy": balanced_accuracy_score(
                y_dev, predictions
            ),
        })

    results = pd.DataFrame(rows)

    output = Path("ml/evaluation/results/dev_model_comparison.csv")
    output.parent.mkdir(parents=True, exist_ok=True)
    results.to_csv(output, index=False)

    print("\nFINAL DEVELOPMENT COMPARISON")
    print(results.to_string(index=False))
    print("\nDevelopment participants:", len(dev_df))
    print("Saved:", output)


if __name__ == "__main__":
    compare_dev_models()