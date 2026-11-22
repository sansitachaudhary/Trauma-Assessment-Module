
from app.models import User, Case, Assessment


def create_user(db_session, email, role):
    user = User(
        full_name=f"Test {role.title()}",
        email=email,
        hashed_password="test-hash",
        role=role,
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


def create_case(db_session, user):
    case = Case(
        description="Fictional test case for access control.",
        language="en",
        created_by=user.id,
    )
    db_session.add(case)
    db_session.commit()
    db_session.refresh(case)
    return case


def create_assessment(db_session, case):
    assessment = Assessment(
        case_id=case.id,
        svi=0,
        indicators=["distress_language"],
        safety_review_required=True,
        review_status="pending",
        model_version="rules-demo-v1",
    )
    db_session.add(assessment)
    db_session.commit()
    db_session.refresh(assessment)
    return assessment


def authenticate_as(client, user):
    from app.core.dependencies import get_current_user
    client.app.dependency_overrides[get_current_user] = lambda: user


def test_assessor_cannot_view_another_assessors_case(client, db_session, assessor_user):
    other_assessor = create_user(db_session, "other@test.com", "assessor")
    other_case = create_case(db_session, other_assessor)

    response = client.get(f"/api/v1/complaints/{other_case.id}")

    assert response.status_code == 404


def test_assessor_cannot_create_assessment_for_another_assessors_case(client, db_session, assessor_user):
    other_assessor = create_user(db_session, "other2@test.com", "assessor")
    other_case = create_case(db_session, other_assessor)

    response = client.post(
        "/api/v1/assessments",
        json={"case_id": other_case.id},
    )

    assert response.status_code == 404


def test_assessor_cannot_view_another_assessors_assessment(client, db_session, assessor_user):
    other_assessor = create_user(db_session, "other3@test.com", "assessor")
    other_case = create_case(db_session, other_assessor)
    assessment = create_assessment(db_session, other_case)

    response = client.get(f"/api/v1/assessments/{assessment.id}")

    assert response.status_code == 404


def test_reviewer_can_view_all_cases(client, db_session, assessor_user):
    other_assessor = create_user(db_session, "other4@test.com", "assessor")
    other_case = create_case(db_session, other_assessor)

    reviewer = create_user(db_session, "reviewer@test.com", "reviewer")
    authenticate_as(client, reviewer)

    response = client.get(f"/api/v1/complaints/{other_case.id}")

    assert response.status_code == 200


def test_reviewer_can_review_assessment(client, db_session, assessor_user):
    case = create_case(db_session, assessor_user)
    assessment = create_assessment(db_session, case)

    reviewer = create_user(db_session, "reviewer2@test.com", "reviewer")
    authenticate_as(client, reviewer)

    response = client.patch(
        f"/api/v1/assessments/{assessment.id}/review",
        json={"review_status": "approved"},
    )

    assert response.status_code == 200
    assert response.json()["review_status"] == "approved"


def test_reviewer_cannot_use_ml_prediction(client, db_session, assessor_user):
    reviewer = create_user(db_session, "reviewer3@test.com", "reviewer")
    authenticate_as(client, reviewer)

    response = client.post(
        "/api/v1/ml/predict",
        json={"text": "Fictional test text"},
    )

    assert response.status_code == 403


def test_unauthenticated_user_cannot_access_complaints(client):
    from app.core.dependencies import get_current_user

    client.app.dependency_overrides.pop(get_current_user, None)

    response = client.get("/api/v1/complaints")

    assert response.status_code == 401
