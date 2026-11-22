from typing import TYPE_CHECKING
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text

if TYPE_CHECKING:
    from app.models.assessment import Assessment

from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class Case(Base):
    __tablename__ = "cases"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    created_by: Mapped[int | None] = mapped_column(
    ForeignKey("users.id", ondelete="RESTRICT"),
    nullable=False,
    index=True,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    language: Mapped[str] = mapped_column(
        String(20),
        default="en",
        nullable=False,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        default="pending_review",
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    assessments: Mapped[list["Assessment"]] = relationship(
        back_populates="case",
        cascade="all, delete-orphan",
    )
creator = relationship("User")