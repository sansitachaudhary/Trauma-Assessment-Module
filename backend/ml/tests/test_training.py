import joblib
import pandas as pd

from ml.training.train import train_model


def test_train_model_saves_loadable_model_and_returns_metrics(tmp_path):
    dataset_path = tmp_path / "training.csv"
    model_path = tmp_path / "artifacts" / "model.joblib"
    evaluation_dir = tmp_path / "evaluation"

    pd.DataFrame({
        "text": [
            "I feel happy and energetic",
            "I enjoy spending time with friends",
            "I feel calm and rested",
            "I am doing well today",
            "I feel positive about life",
            "I feel sad and exhausted",
            "I cannot sleep at night",
            "I feel hopeless and alone",
            "I have no energy today",
            "I feel overwhelmed and low",
        ],
        "label": [0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
    }).to_csv(dataset_path, index=False)

    result = train_model(
        dataset_path=str(dataset_path),
        text_column="text",
        label_column="label",
        output_path=str(model_path),
        evaluation_output_dir=str(evaluation_dir),
    )

    assert model_path.exists()
    assert result["final_model_samples"] == 10
    assert result["train_samples"] + result["test_samples"] == 10
    assert set(result["classes"]) == {"0", "1"}
    assert "macro_f1" in result["metrics"]

    saved_model = joblib.load(model_path)
    predictions = saved_model.predict(["I feel calm and rested"])
    assert len(predictions) == 1