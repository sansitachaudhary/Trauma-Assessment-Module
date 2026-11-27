
import sys
from pathlib import Path

# Ensure backend and repo root are in sys.path
_backend_dir = Path(__file__).resolve().parent.parent
_root_dir = _backend_dir.parent
for _p in [str(_backend_dir), str(_root_dir)]:
    if _p not in sys.path:
        sys.path.insert(0, _p)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.database import Base, get_db
from app.main import app
<<<<<<< Updated upstream
from app.models import Assessment, Case, User
from app.models.assessment_review import AssessmentReview
=======
from app.models import Assessment, Case

>>>>>>> Stashed changes

@pytest.fixture
def db_session():
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    TestingSessionLocal = sessionmaker(
        bind=test_engine,
        autoflush=False,
        expire_on_commit=False,
    )

    Base.metadata.create_all(bind=test_engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()

@pytest.fixture
def assessor_user(db_session):
    user = User(
        full_name="Test Assessor",
        email="assessor@test.com",
        hashed_password="test-hash",
        role="assessor",
        is_active=True,
    )

    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    return user


@pytest.fixture
def client(db_session, assessor_user):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    # Simulate an authenticated assessor for ordinary API tests.
    from app.core.dependencies import get_current_user
    app.dependency_overrides[get_current_user] = lambda: assessor_user

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
