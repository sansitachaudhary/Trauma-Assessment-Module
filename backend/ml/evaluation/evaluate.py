
from pathlib import Path

import matplotlib
matplotlib.use("Agg")

import matplotlib.pyplot as plt
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    ConfusionMatrixDisplay,
    precision_recall_fscore_support,
)


def evaluate_classifier(
    y_true,
    y_pred,
    labels=None,
    output_dir="ml/evaluation/results",
):
    """
    Evaluate predictions against ground-truth labels.

    y_true: genuine dataset labels
    y_pred: predictions from a trained model
    labels: optional, explicitly ordered class labels
    output_dir: directory for evaluation artifacts
    """
    if len(y_true) == 0:
        raise ValueError("Evaluation data cannot be empty.")

    if len(y_true) != len(y_pred):
        raise ValueError(
            "Ground-truth labels and predictions must have equal lengths."
        )

    if any(label is None for label in y_true) or any(
        label is None for label in y_pred
    ):
        raise ValueError("Ground-truth labels and predictions cannot contain None.")

    if labels is None:
        labels = sorted(set(y_true) | set(y_pred), key=str)
    else:
        labels = list(labels)
        if not labels:
            raise ValueError("Evaluation labels cannot be empty.")

        observed_labels = set(y_true) | set(y_pred)
        if not observed_labels.issubset(set(labels)):
            raise ValueError(
                "Evaluation labels must include every true and predicted class."
            )

    accuracy = accuracy_score(y_true, y_pred)

    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true,
        y_pred,
        labels=labels,
        average="macro",
        zero_division=0,
    )

    report = classification_report(
        y_true,
        y_pred,
        labels=labels,
        zero_division=0,
    )

    matrix = confusion_matrix(y_true, y_pred, labels=labels)

    results = {
        "accuracy": float(accuracy),
        "macro_precision": float(precision),
        "macro_recall": float(recall),
        "macro_f1": float(f1),
        "labels": [str(label) for label in labels],
        "classification_report": report,
        "confusion_matrix": matrix.tolist(),
    }

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    display = ConfusionMatrixDisplay(
        confusion_matrix=matrix,
        display_labels=labels,
    )
    display.plot(values_format="d", xticks_rotation=45)
    plt.tight_layout()
    plt.savefig(output_path / "confusion_matrix.png", dpi=150)
    plt.close()

    return results
