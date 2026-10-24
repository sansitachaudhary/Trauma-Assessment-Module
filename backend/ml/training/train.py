
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from ml.config import RANDOM_SEED
from ml.preprocessing.prepare_dataset import prepare_dataset


def train_model(
    dataset_path: str,
    text_column: str,
    label_column: str,
    output_path: str = "ml/artifacts/text_classifier.joblib",
):
    """
    Train a baseline text classifier on a labelled research dataset.

    Use only data you are authorized to access and process.
    This function does not establish clinical validity.
    """
    df = prepare_dataset(
        input_path=dataset_path,
        text_column=text_column,
        label_column=label_column,
    )

    if df[label_column].value_counts().min() < 2:
        raise ValueError(
            "Each class needs at least two records for a stratified split."
        )

    X_train, X_test, y_train, y_test = train_test_split(
        df[text_column],
        df[label_column],
        test_size=0.2,
        random_state=RANDOM_SEED,
        stratify=df[label_column],
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("classifier", LogisticRegression(
            max_iter=1000,
            class_weight="balanced",
            random_state=RANDOM_SEED,
        )),
    ])

    model.fit(X_train, y_train)

    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output)

    return {
        "model_path": str(output),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "classes": [str(label) for label in model.classes_],
    }


if __name__ == "__main__":
    print(
        "Training module ready. Run training only after "
        "verifying the authorized dataset and its label definitions."
    )
