
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AssessmentCreate(BaseModel):
    case_id: int = Field(gt=0)


class AssessmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    case_id: int
    svi: int
    indicators: list[str]
    safety_review_required: bool
    review_status: str
    model_version: str
    created_at: datetime
