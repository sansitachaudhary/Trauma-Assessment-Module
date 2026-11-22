
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class AssessmentCreate(BaseModel):
    case_id: int = Field(gt=0)


class AssessmentReview(BaseModel):
    review_status: Literal["approved", "rejected"]


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


class AssessmentReviewResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    assessment_id: int
    reviewer_id: int
    review_status: str
    reviewed_at: datetime
