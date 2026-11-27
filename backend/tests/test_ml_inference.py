import pytest

from app.services import ml_inference


class FakeModel:
    classes_ = [0, 1]

    def predict(self, texts):
        assert texts == ["fictional test narrative"]
        return [1]

    def predict_proba(self, texts):
        assert texts == ["fictional test narrative"]
        return [[0.25, 0.75]]


def test_load_model_loads_and_caches_artifact(monkeypatch, tmp_path):
    artifact_path = tmp_path / "model.joblib"
    artifact_path.touch()
    model = object()
    loaded_paths = []

    monkeypatch.setattr(ml_inference, "_model", None)
    monkeypatch.setattr(ml_inference, "MODEL_PATH", artifact_path)
    monkeypatch.setattr(
        ml_inference.joblib,
        "load",
        lambda path: loaded_paths.append(path) or model,
    )

    assert ml_inference.load_model() is model
    assert ml_inference.load_model() is model
    assert loaded_paths == [artifact_path]


def test_load_model_reports_missing_artifact(monkeypatch, tmp_path):
    monkeypatch.setattr(ml_inference, "_model", None)
    monkeypatch.setattr(
        ml_inference,
        "MODEL_PATH",
        tmp_path / "missing-model.joblib",
    )

    with pytest.raises(FileNotFoundError, match="ML model artifact not found"):
        ml_inference.load_model()


def test_predict_text_returns_research_prediction(monkeypatch):
    monkeypatch.setattr(ml_inference, "load_model", lambda: FakeModel())

    result = ml_inference.predict_text("  fictional   test narrative  ")

    assert result == {
        "predicted_label": 1,
        "class_probabilities": {"0": 0.25, "1": 0.75},
        "model_version": "daicwoz-tfidf-logistic-v1",
        "research_only": True,
        "clinical_use": False,
        "label_meaning": (
            "DAIC-WOZ PHQ8_Binary depression-screening label; "
            "not a trauma or PTSD diagnosis."
        ),
    }


def test_predict_text_rejects_text_that_cleans_to_empty():
    with pytest.raises(ValueError, match="Text cannot be empty"):
        ml_inference.predict_text("   \n\t ")
