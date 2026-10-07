from fastapi import APIRouter

from app.schemas.suggestions import SuggestionsRequest, SuggestionsResponse
from app.services import suggestion_service

router = APIRouter(tags=["suggestions"])


@router.post(
    "/suggestions",
    response_model=SuggestionsResponse,
    summary="Generate suggestions from a completed analysis",
)
async def get_suggestions(payload: SuggestionsRequest) -> SuggestionsResponse:
    """
    Request -> Service -> Response.

    Pydantic validates `payload` automatically (missing/invalid fields
    produce a 422 before this function body even runs), so there's no
    manual validation to write here.
    """
    return await suggestion_service.generate_suggestions(payload)
