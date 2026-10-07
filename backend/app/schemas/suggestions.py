"""Request/response contracts for the AI suggestions endpoint."""

from pydantic import BaseModel, Field


class SuggestionsRequest(BaseModel):
    """
    Structured analysis results sent back from React after /api/analyze,
    used to generate personalized suggestions.
    """

    ats_score: float = Field(..., ge=0, le=100)
    matched_skills: list[str] = Field(default_factory=list)
    missing_skills: list[str] = Field(default_factory=list)
    keyword_match_percentage: float = Field(..., ge=0, le=100)

    model_config = {
        "json_schema_extra": {
            "example": {
                "ats_score": 87,
                "matched_skills": ["Python", "React"],
                "missing_skills": ["Docker"],
                "keyword_match_percentage": 82.0,
            }
        }
    }


class SuggestionItem(BaseModel):
    title: str
    description: str
    priority: str = Field(..., description="'high' | 'medium' | 'low'")


class SuggestionsResponse(BaseModel):
    """Shape returned by POST /api/suggestions, ready for the dashboard."""

    summary: str
    suggestions: list[SuggestionItem] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "example": {
                "summary": "Your resume is a good match. A few gaps to close before applying.",
                "suggestions": [
                    {
                        "title": "Add Docker experience",
                        "description": "The job description emphasizes containerization. Mention any Docker usage, even in side projects.",
                        "priority": "high",
                    }
                ],
            }
        }
    }
