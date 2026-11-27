

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseResponse, CaseUpdate
from app.core.dependencies import require_roles

router = APIRouter(prefix="/api/v1/complaints", tags=["Complaints"])


@router.post(
    "",
    response_model=CaseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_complaint(
    payload: CaseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor")),
):
    case = Case(
        description=payload.description,
        language=payload.language,
        created_by=current_user.id,
        notes=payload.notes,
        rule_based_score=payload.rule_based_score,
        rule_based_priority=payload.rule_based_priority,
        rule_based_indicators=[
            indicator.model_dump()
            for indicator in payload.rule_based_indicators
        ],
        history=[
            f"{datetime.now(timezone.utc).strftime('%d %b %Y')} · Complaint submitted via API"
        ],
    )

    db.add(case)
    db.commit()
    db.refresh(case)

    return case


@router.get("", response_model=list[CaseResponse])
def list_complaints(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor", "reviewer")),
):
    statement = select(Case).order_by(Case.created_at.desc())

    if current_user.role == "assessor":
        statement = statement.where(Case.created_by == current_user.id)

    return db.scalars(statement).all()


@router.get("/{case_id}", response_model=CaseResponse)
def get_complaint(
    case_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor", "reviewer")),
):
    statement = select(Case).where(Case.id == case_id)

    if current_user.role == "assessor":
        statement = statement.where(Case.created_by == current_user.id)

    case = db.scalar(statement)

    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found",
        )

    return case


@router.patch("/{case_id}", response_model=CaseResponse)
def update_complaint(
    case_id: int,
    payload: CaseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor")),
):
    statement = select(Case).where(Case.id == case_id)

    if current_user.role == "assessor":
        statement = statement.where(Case.created_by == current_user.id)

    case = db.scalar(statement)

    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found",
        )

    changes = payload.model_dump(
        exclude_unset=True,
        exclude_none=True,
        exclude={"history_message"},
    )

    if not changes and payload.history_message is None:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one case field or history message is required",
        )

    for field, value in changes.items():
        if field == "rule_based_indicators":
            value = [
                indicator.model_dump()
                for indicator in value
            ]

        setattr(case, field, value)

    if payload.history_message is not None:
        event = (
            f"{datetime.now(timezone.utc).strftime('%d %b %Y')} · "
            f"{payload.history_message}"
        )
        case.history = [event, *(case.history or [])]

    db.commit()
    db.refresh(case)

    return case
