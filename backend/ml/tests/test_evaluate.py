
import pytest

from ml.evaluation.evaluate import evaluate_classifier


def test_evaluate_classifier_calculates_metrics(tmp_path):
    y_true = [0, 0, 1, 1]
    y_pred = [0, 1, 1, 1]

    results = evaluate_classifier(
        y_true=y_true,
        y_pred=y_pred,
        labels=[0, 1],
        output_dir=tmp_path,
    )

    assert results["accuracy"] == 0.75
    assert results["macro_precision"] == pytest.approx(0.8333, abs=0.001)
    assert results["macro_recall"] == 0.75
    assert results["macro_f1"] == pytest.approx(0.7333, abs=0.001)
    assert results["confusion_matrix"] == [[1, 1], [0, 2]]
    assert results["labels"] == ["0", "1"]
    assert (tmp_path / "confusion_matrix.png").exists()


def test_evaluate_classifier_rejects_empty_data(tmp_path):
    with pytest.raises(ValueError, match="cannot be empty"):
        evaluate_classifier(
            y_true=[],
            y_pred=[],
            output_dir=tmp_path,
        )


def test_evaluate_classifier_rejects_mismatched_lengths(tmp_path):
    with pytest.raises(ValueError, match="equal lengths"):
        evaluate_classifier(
            y_true=[0, 1],
            y_pred=[0],
            output_dir=tmp_path,
        )


def test_evaluate_classifier_rejects_none_labels(tmp_path):
    with pytest.raises(ValueError, match="cannot contain None"):
        evaluate_classifier(
            y_true=[0, None],
            y_pred=[0, 1],
            labels=[0, 1],
            output_dir=tmp_path,
        )


def test_evaluate_classifier_rejects_incomplete_class_labels(tmp_path):
    with pytest.raises(ValueError, match="include every true and predicted class"):
        evaluate_classifier(
            y_true=[0, 1],
            y_pred=[0, 1],
            labels=[0],
            output_dir=tmp_path,
        )


def test_evaluate_classifier_rejects_empty_class_list(tmp_path):
    with pytest.raises(ValueError, match="labels cannot be empty"):
        evaluate_classifier(
            y_true=[0, 1],
            y_pred=[0, 1],
            labels=[],
            output_dir=tmp_path,
        )
