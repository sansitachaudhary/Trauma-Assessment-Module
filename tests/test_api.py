
def test_health_endpoint(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_create_complaint(client):
    response = client.post(
        "/api/v1/complaints",
        json={
            "description": "Fictional test case for automated testing.",
            "language": "en",
        },
    )

    assert response.status_code == 201

    data = response.json()
    assert data["description"] == "Fictional test case for automated testing."
    assert data["language"] == "en"
    assert data["status"] == "pending_review"
    assert "id" in data


def test_create_assessment_for_nonexistent_case(client):
    response = client.post(
        "/api/v1/assessments",
        json={"case_id": 999999999},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Case not found"


def test_create_assessment_for_existing_case(client):
    case_response = client.post(
        "/api/v1/complaints",
        json={
            "description": "Fictional test text. I feel very stressed and cannot sleep.",
            "language": "en",
        },
    )

    assert case_response.status_code == 201
    case_id = case_response.json()["id"]

    assessment_response = client.post(
        "/api/v1/assessments",
        json={"case_id": case_id},
    )

    assert assessment_response.status_code == 201

    data = assessment_response.json()
    assert data["case_id"] == case_id
    assert "distress_language" in data["indicators"]
    assert "sleep_concern" in data["indicators"]
    assert data["safety_review_required"] is True
    assert data["review_status"] == "pending"
