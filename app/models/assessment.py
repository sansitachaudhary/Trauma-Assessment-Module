from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.case import Case
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    JSON,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    case_id: Mapped[int] = mapped_column(
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    svi: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    indicators: Mapped[list] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    safety_review_required: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    review_status: Mapped[str] = mapped_column(
        String(30),
        default="pending",
        nullable=False,
    )

    model_version: Mapped[str] = mapped_column(
        String(50),
        default="rules-demo-v1",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    case: Mapped["Case"] = relationship(
        back_populates="assessments",
    )
