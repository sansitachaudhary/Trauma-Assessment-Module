
from pathlib import Path

import pandas as pd

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_predict
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix

from ml.config import RANDOM_SEED


def analyze_positive_weight():
    df = pd.read_csv("ml/data/processed/train_prepared.csv")

    X = df["text"].fillna("").astype(str)
    y = df["label"].astype(int)

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            ngram_range=(1, 2),
            min_df=1,
        )),
        ("classifier", LogisticRegression(
            max_iter=1000,
            class_weight={0: 1, 1: 3},
            random_state=RANDOM_SEED,
        )),
    ])

    cv = StratifiedKFold(
        n_splits=5,
        shuffle=True,
        random_state=RANDOM_SEED,
    )

    predictions = cross_val_predict(
        model,
        X,
        y,
        cv=cv,
        n_jobs=-1,
    )

    print("POSITIVE WEIGHT 3 - CONFUSION MATRIX")
    print(confusion_matrix(y, predictions, labels=[0, 1]))

    print("\nCLASSIFICATION REPORT")
    print(classification_report(
        y,
        predictions,
        labels=[0, 1],
        zero_division=0,
    ))

    print("\nPREDICTED LABEL COUNTS")
    print(pd.Series(predictions).value_counts().sort_index())

    output = Path("ml/evaluation/results/cv_predictions_positive3.csv")
    output.parent.mkdir(parents=True, exist_ok=True)

    pd.DataFrame({
        "actual_label": y,
        "predicted_label": predictions,
    }).to_csv(output, index=False)

    print("\nSaved:", output)


if __name__ == "__main__":
    analyze_positive_weight()