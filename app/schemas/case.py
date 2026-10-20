
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CaseCreate(BaseModel):
    description: str = Field(min_length=1, max_length=10000)
    language: str = Field(default="en", max_length=20)


class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    description: str
    language: str
    status: str
    created_at: datetime
