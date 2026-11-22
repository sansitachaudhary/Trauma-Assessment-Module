
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.assessment import Assessment
from app.models.case import Case
from app.services.text_analysis import analyze_text
from app.core.dependencies import require_roles
from app.models.assessment_review import AssessmentReview as AssessmentReviewRecord
from app.schemas.assessment import AssessmentReviewResponse
from app.schemas.assessment import (
    AssessmentCreate,
    AssessmentResponse,
    AssessmentReview,
)
router = APIRouter(prefix="/api/v1/assessments", tags=["Assessments"])


@router.post(
    "",
    response_model=AssessmentResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_assessment(
    payload: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor")),
):
    case = db.get(Case, payload.case_id)

    if case is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found",
        )
    if current_user.role == "assessor" and case.created_by != current_user.id:
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
    current_user=Depends(require_roles("admin", "assessor", "reviewer")),
):
    assessment = db.get(Assessment, assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    if current_user.role == "assessor":
        case = db.get(Case, assessment.case_id)

        if case is None or case.created_by != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Assessment not found",
            )

    return assessment



@router.patch("/{assessment_id}/review", response_model=AssessmentResponse)
def review_assessment(
    assessment_id: int,
    payload: AssessmentReview,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "reviewer")),
):
    assessment = db.get(Assessment, assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    
    if assessment.review_status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This assessment has already been reviewed",
        )

    # 1. Update assessment status
    assessment.review_status = payload.review_status

    # 2. Create audit record
    review_record = AssessmentReviewRecord(
        assessment_id=assessment.id,
        reviewer_id=current_user.id,
        review_status=payload.review_status,
    )

    # 3. Save both changes
    db.add(review_record)

    try:
        db.commit()
        db.refresh(assessment)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save assessment review",
        )

    return assessment


@router.get(
    "/{assessment_id}/reviews",
    response_model=list[AssessmentReviewResponse],
)
def get_assessment_reviews(
    assessment_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "assessor", "reviewer")),
):
    assessment = db.get(Assessment, assessment_id)

    if assessment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    if current_user.role == "assessor":
        case = db.get(Case, assessment.case_id)

    if case is None or case.created_by != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found",
        )

    reviews = (
        db.query(AssessmentReviewRecord)
        .filter(AssessmentReviewRecord.assessment_id == assessment_id)
        .order_by(AssessmentReviewRecord.reviewed_at.desc())
        .all()
    )

    return reviews
