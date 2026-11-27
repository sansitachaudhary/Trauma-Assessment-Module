
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


ReviewStatus = Literal[
    "New",
    "Pending review",
    "In review",
    "Reviewed",
    "Referred",
    "Follow-up requested",
    "Closed",
]
Priority = Literal["Low", "Moderate", "High", "Urgent review"]
IndicatorKey = Literal["fear", "duration", "safety", "overwhelm"]


class RuleBasedIndicator(BaseModel):
    key: IndicatorKey
    label: str
    evidence: str


class CaseCreate(BaseModel):
    description: str = Field(min_length=1, max_length=10000)
    language: str = Field(default="en", max_length=20)
    notes: str = ""
    rule_based_score: int = Field(default=0, ge=0, le=100)
    rule_based_priority: Priority = "Low"
    rule_based_indicators: list[RuleBasedIndicator] = Field(default_factory=list)


class CaseUpdate(BaseModel):
    status: ReviewStatus | None = None
    assigned: str | None = Field(default=None, max_length=255)
    notes: str | None = None
    rule_based_score: int | None = Field(default=None, ge=0, le=100)
    rule_based_priority: Priority | None = None
    rule_based_indicators: list[RuleBasedIndicator] | None = None
    history_message: str | None = Field(default=None, min_length=1, max_length=500)


class CaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    description: str
    language: str
    status: str
    assigned: str
    notes: str
    rule_based_score: int
    rule_based_priority: Priority
    rule_based_indicators: list[RuleBasedIndicator]
    history: list[str]
    created_at: datetime
