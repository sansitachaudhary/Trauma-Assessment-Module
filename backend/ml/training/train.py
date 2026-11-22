
from pathlib import Path

import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import precision_recall_fscore_support
from sklearn.metrics import precision_recall_fscore_support
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline

from ml.config import RANDOM_SEED
from ml.preprocessing.prepare_dataset import prepare_dataset
from ml.evaluation.evaluate import evaluate_classifier


def train_model(
    dataset_path: str,
    text_column: str,
    label_column: str,
    output_path: str = "ml/artifacts/text_classifier.joblib",
    evaluation_output_dir: str = "ml/evaluation/results",
    class_weight="balanced",
):
    """
    Train and evaluate a baseline text classifier.

    Internal holdout metrics are calculated before the final model
    is refitted on all available training data.

    This experimental model is not clinically validated.
    """
    df = prepare_dataset(
        input_path=dataset_path,
        text_column=text_column,
        label_column=label_column,
    )

    # Validate labels before creating a stratified split.
    if df[label_column].nunique() < 2:
        raise ValueError("Training data must contain at least two classes.")

    if df[label_column].value_counts().min() < 2:
        raise ValueError(
            "Each class needs at least two records for a stratified split."
        )

    X = df[text_column]
    y = df[label_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_SEED,
        stratify=y,
    )

    model = Pipeline([
        (
            "tfidf",
            TfidfVectorizer(
                ngram_range=(1, 2),
                min_df=1,
            ),
        ),
        (
            "classifier",
            LogisticRegression(
                max_iter=1000,
                class_weight=class_weight,
                random_state=RANDOM_SEED,
            ),
        ),
    ])

    # Train on the internal training partition.
    model.fit(X_train, y_train)

    # Evaluate before refitting, so the holdout remains unseen during fit.
    y_pred = model.predict(X_test)

    # Explore thresholds on the internal holdout only.
    class_1_index = list(model.classes_).index(1)
    y_prob = model.predict_proba(X_test)[:, class_1_index]

    print("\nHoldout threshold comparison:")
    for threshold in (0.40, 0.45, 0.50, 0.55, 0.60):
        threshold_pred = (y_prob >= threshold).astype(int)

        precision, recall, f1, _ = precision_recall_fscore_support(
            y_test,
            threshold_pred,
            labels=[1],
            average=None,
            zero_division=0,
        )

        print(
            f"threshold={threshold:.2f} | "
            f"class_1_precision={precision[0]:.4f} | "
            f"class_1_recall={recall[0]:.4f} | "
            f"class_1_f1={f1[0]:.4f}"
        )

    metrics = evaluate_classifier(
        y_true=y_test.tolist(),
        y_pred=y_pred.tolist(),
        labels=sorted(y.unique().tolist()),
        output_dir=evaluation_output_dir,
    )

    # Refit the final model on all available training participants.
    # Do not include development data here.
    model.fit(X, y)

    # Save the final fitted model.
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output)

    return {
        "model_path": str(output),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "final_model_samples": len(X),
        "classes": [str(label) for label in model.classes_],
        "metrics": {
            "accuracy": metrics["accuracy"],
            "macro_precision": metrics["macro_precision"],
            "macro_recall": metrics["macro_recall"],
            "macro_f1": metrics["macro_f1"],
            "confusion_matrix": metrics["confusion_matrix"],
        },
    }


if __name__ == "__main__":
    from ml.config import PROCESSED_DATA_DIR

    dataset_path = PROCESSED_DATA_DIR / "train_prepared.csv"

    result = train_model(
        dataset_path=str(dataset_path),
        text_column="text",
        label_column="label",
    )

    print("Training completed.")
    print(result)