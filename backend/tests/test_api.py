
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


def test_complaint_workflow_fields_persist_across_partial_updates(client):
    narrative = (
        "Fictional intake statement. " * 12
        + "The complete narrative ending is preserved."
    )
    create_response = client.post(
        "/api/v1/complaints",
        json={
            "description": narrative,
            "language": "en",
            "notes": "Initial responder note.",
            "rule_based_score": 20,
            "rule_based_priority": "Low",
            "rule_based_indicators": [
                {
                    "key": "fear",
                    "label": "Expressed fear",
                    "evidence": "fictional evidence",
                }
            ],
        },
    )

    assert create_response.status_code == 201
    created = create_response.json()
    case_id = created["id"]
    assert created["description"] == narrative

    assignment_response = client.patch(
        f"/api/v1/complaints/{case_id}",
        json={
            "assigned": "Placeholder responder",
            "history_message": "Responder assigned",
        },
    )
    assert assignment_response.status_code == 200
    assigned = assignment_response.json()
    assert assigned["assigned"] == "Placeholder responder"
    assert assigned["status"] == "pending_review"
    assert assigned["notes"] == "Initial responder note."
    assert assigned["rule_based_score"] == 20
    assert assigned["description"] == narrative

    status_response = client.patch(
        f"/api/v1/complaints/{case_id}",
        json={
            "status": "Reviewed",
            "history_message": "Review status updated",
        },
    )
    assert status_response.status_code == 200
    reviewed = status_response.json()
    assert reviewed["status"] == "Reviewed"
    assert reviewed["assigned"] == "Placeholder responder"
    assert reviewed["notes"] == "Initial responder note."
    assert reviewed["rule_based_score"] == 20
    assert reviewed["description"] == narrative

    notes_response = client.patch(
        f"/api/v1/complaints/{case_id}",
        json={
            "notes": "Follow-up note.",
            "history_message": "Responder notes updated",
        },
    )
    assert notes_response.status_code == 200
    updated_notes = notes_response.json()
    assert updated_notes["status"] == "Reviewed"
    assert updated_notes["assigned"] == "Placeholder responder"
    assert updated_notes["notes"] == "Follow-up note."
    assert updated_notes["rule_based_score"] == 20
    assert updated_notes["description"] == narrative

    reload_response = client.get(f"/api/v1/complaints/{case_id}")
    assert reload_response.status_code == 200
    data = reload_response.json()
    assert data["status"] == "Reviewed"
    assert data["assigned"] == "Placeholder responder"
    assert data["notes"] == "Follow-up note."
    assert data["rule_based_score"] == 20
    assert data["rule_based_priority"] == "Low"
    assert data["rule_based_indicators"][0]["key"] == "fear"
    assert data["description"] == narrative
    assert len(data["history"]) == 4
    assert "Responder notes updated" in data["history"][0]
    assert "Review status updated" in data["history"][1]
    assert "Responder assigned" in data["history"][2]


def test_update_complaint_returns_not_found_for_unknown_case(client):
    response = client.patch(
        "/api/v1/complaints/999999999",
        json={"status": "Reviewed"},
    )

    assert response.status_code == 404
    assert response.json()["detail"] == "Case not found"


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


def test_ml_prediction_endpoint_rejects_empty_string(client):
    response = client.post(
        "/api/v1/ml/predict",
        json={"text": ""},
    )

    assert response.status_code == 422


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