
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field

from app.schemas.ml import MLPredictionResponse
from app.services.ml_inference import predict_text
from app.core.dependencies import require_roles


router = APIRouter(
    prefix="/api/v1/ml",
    tags=["Experimental ML"],
)


class MLPredictionRequest(BaseModel):
    text: str = Field(min_length=1, max_length=20000)



@router.post("/predict")
@router.post("/predict", response_model=MLPredictionResponse)
def predict(
    payload: MLPredictionRequest,
    current_user=Depends(require_roles("admin", "assessor")),
):

    try:
        return predict_text(payload.text)

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except FileNotFoundError:
        raise HTTPException(
            status_code=503,
            detail="Experimental ML model is unavailable.",
        )
