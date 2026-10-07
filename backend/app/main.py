from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import analyze, health, suggestions
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "API layer for the Resume ATS Analyzer. This service only validates "
        "requests and delegates to service-layer functions — the real "
        "NLP/DSA/AI engine lives in app/services and is swapped in separately."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(analyze.router, prefix="/api")
app.include_router(suggestions.router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root() -> dict:
    return {"message": f"{settings.app_name} is running. See /docs for API documentation."}
