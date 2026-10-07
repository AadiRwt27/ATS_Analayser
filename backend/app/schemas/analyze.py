"""Request/response contracts for the resume analysis endpoint."""

from pydantic import BaseModel, Field


class AnalysisResponse(BaseModel):
    ats_score: float = Field(ge=0, le=100)
    matched_skills: list[str]
    missing_skills: list[str]
    keyword_match_percentage: float
    experience_match: bool
    education_match: bool
    suggestions_context: dict




