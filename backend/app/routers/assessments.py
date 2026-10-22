
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.assessment import Assessment
from app.models.case import Case
from app.schemas.assessment import AssessmentCreate, AssessmentResponse
from app.services.text_analysis import analyze_text

router = APIRouter(prefix="/api/v1/assessments", tags=["Assessments"])


@router.post(
    "",
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
):
    case = db.get(Case, payload.case_id)

    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found",
        )

    analysis = analyze_text(case.description)

    assessment = Assessment(
        case_id=case.id,
        svi=0,
        indicators=analysis.indicators,
        safety_review_required=True,
        review_status="pending",
        model_version=analysis.model_version,
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment


@router.get("/{assessment_id}", response_model=AssessmentResponse)
def get_assessment(
    assessment_id: int,
    db: Session = Depends(get_db),
):
    assessment = db.get(Assessment, assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    return assessment
