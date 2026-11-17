
from pathlib import Path

import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline

from ml.config import RANDOM_SEED


DATA_PATH = "ml/data/processed/train_prepared.csv"
OUTPUT_PATH = "ml/evaluation/results/class_weight_comparison.csv"


def build_models():
    weights = {
        "balanced": "balanced",
        "equal": {0: 1, 1: 1},
        "positive_1_5": {0: 1, 1: 1.5},
        "positive_2": {0: 1, 1: 2},
        "positive_3": {0: 1, 1: 3},
    }

    models = {}

    for name, weight in weights.items():
        models[name] = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                min_df=1,
            )),
            ("classifier", LogisticRegression(
                max_iter=1000,
                class_weight=weight,
                random_state=RANDOM_SEED,
            )),
        ])

    return models


def compare_models():
    df = pd.read_csv(DATA_PATH)

    X = df["text"].fillna("").astype(str)
    y = df["label"].astype(int)

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=RANDOM_SEED,
    )

    scoring = {
        "macro_f1": "f1_macro",
        "class_1_recall": "recall",
        "balanced_accuracy": "balanced_accuracy",
    }

    rows = []

    for name, model in build_models().items():
        print(f"\nEvaluating: {name}")

        scores = cross_validate(
            model,
            X,
            y,
            cv=cv,
            scoring=scoring,
            n_jobs=-1,
            return_train_score=False,
        )

        row = {"class_weight": name}

        for metric in scoring:
            values = scores[f"test_{metric}"]
            row[f"{metric}_mean"] = values.mean()
            row[f"{metric}_std"] = values.std()

        rows.append(row)

        print(
            f"Macro F1: {row['macro_f1_mean']:.4f} | "
            f"Class 1 recall: {row['class_1_recall_mean']:.4f}"
        )

    results = pd.DataFrame(rows).sort_values(
        "macro_f1_mean",
        ascending=False,
    )

    output = Path(OUTPUT_PATH)
    output.parent.mkdir(parents=True, exist_ok=True)
    results.to_csv(output, index=False)

    print("\nCLASS WEIGHT COMPARISON")
    print(results.to_string(index=False))
    print("\nSaved:", output)


if __name__ == "__main__":
    compare_models()