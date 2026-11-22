
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.db.database import engine
from app.routers.complaints import router as complaints_router
from app.routers.assessments import router as assessments_router
from app.routers.auth import router as auth_router
from app.routers.ml import router as ml_router


app = FastAPI(
    title="SAHYOG AI — Trauma Assessment Module API",
    description=(
        "Backend API for case intake, assessment records, "
        "and human-reviewed support workflows."
    ),
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)


@app.get("/")
def root():
    return {
        "message": "SAHYOG AI Trauma Assessment Module API",
        "status": "running",
        "version": app.version,
    }


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/health/database")
def database_health_check():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "error", "database": "unavailable"}


app.include_router(complaints_router)
app.include_router(assessments_router)
app.include_router(ml_router)
app.include_router(auth_router)
