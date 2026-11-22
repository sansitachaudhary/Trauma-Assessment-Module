
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


def test_ml_prediction_endpoint_returns_prediction(client, monkeypatch):
    from app.routers import ml as ml_router

    expected = {
        "predicted_label": 0,
        "class_probabilities": {"0": 0.6, "1": 0.4},
        "model_version": "test-model",
        "research_only": True,
        "clinical_use": False,
        "label_meaning": "Test label meaning",
    }

    monkeypatch.setattr(ml_router, "predict_text", lambda text: expected)

    response = client.post(
        "/api/v1/ml/predict",
        json={"text": "A fictional test transcript."},
    )

    assert response.status_code == 200
    assert response.json() == expected


def test_ml_prediction_endpoint_rejects_whitespace(client):
    response = client.post(
        "/api/v1/ml/predict",
        json={"text": "   "},
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Text cannot be empty."


def test_ml_prediction_endpoint_returns_503_when_model_missing(
    client, monkeypatch
):
    from app.routers import ml as ml_router

    def raise_model_missing(text):
        raise FileNotFoundError

    monkeypatch.setattr(ml_router, "predict_text", raise_model_missing)

    response = client.post(
        "/api/v1/ml/predict",
        json={"text": "A fictional test transcript."},
    )

    assert response.status_code == 503
    assert response.json()["detail"] == "Experimental ML model is unavailable."