
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.case import Case
from app.schemas.case import CaseCreate, CaseResponse
from app.core.dependencies import require_roles
from sqlalchemy import select, and_

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