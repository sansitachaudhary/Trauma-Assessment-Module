import joblib
from ml.config import ARTIFACTS_DIR
from ml.preprocessing.clean_text import clean_text

MODEL_PATH = ARTIFACTS_DIR / "text_classifier.joblib"

_model = None

def load_model():
    """
    Load the trained research model once.
    """
    global _model

    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"ML model artifact not found: {MODEL_PATH}"
            )

        _model = joblib.load(MODEL_PATH)

    return _model


def predict_text(text: str) -> dict:
    """
    Generate an experimental DAIC-WOZ depression-screening prediction.

    This output is not a trauma or PTSD diagnosis and is not
    clinically validated.
    """
    cleaned_text = clean_text(text)

    if not cleaned_text:
        raise ValueError("Text cannot be empty.")

    model = load_model()

    prediction = model.predict([cleaned_text])[0]
    probabilities = model.predict_proba([cleaned_text])[0]

    class_probabilities = {
        str(label): float(probability)
        for label, probability in zip(model.classes_, probabilities)
    }

    return {
        "predicted_label": int(prediction),
        "class_probabilities": class_probabilities,
        "model_version": "daicwoz-tfidf-logistic-v1",
        "research_only": True,
        "clinical_use": False,
        "label_meaning": (
            "DAIC-WOZ PHQ8_Binary depression-screening label; "
            "not a trauma or PTSD diagnosis."
        ),
    }
