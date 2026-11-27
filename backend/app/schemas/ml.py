from pydantic import BaseModel


class MLPredictionResponse(BaseModel):
    predicted_label: int
    class_probabilities: dict[str, float]
    model_version: str
    research_only: bool
    clinical_use: bool
    label_meaning: str
