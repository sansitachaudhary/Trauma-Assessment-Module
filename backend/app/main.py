
from fastapi import FastAPI
from app.routers.complaints import router as complaints_router
from app.routers.assessments import router as assessments_router

app = FastAPI(
    title="Trauma Assessment Module API",
    description="Backend API for the SIH26093 project",
    version="0.1.0",
)


@app.get("/")
def root():
    return {
        "message": "Trauma Assessment Module API",
        "status": "running",
    }

app.include_router(complaints_router)
app.include_router(assessments_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
