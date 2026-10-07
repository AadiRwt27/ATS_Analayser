from fastapi import APIRouter, Depends, Form, HTTPException, UploadFile, status

from app.core.config import Settings, get_settings
from app.core.validation import ValidationError, validate_job_description, validate_resume_file
from app.schemas.analyze import AnalysisResponse
from app.services import analysis_service

router = APIRouter(tags=["analyze"])


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Analyze a resume against a job description",
    responses={
        400: {"description": "Missing or invalid job description"},
        413: {"description": "Resume file exceeds the maximum upload size"},
        415: {"description": "Unsupported resume file type"},
    },
)
async def analyze_resume(
    resume: UploadFile,
    job_description: str = Form(...),
    settings: Settings = Depends(get_settings),
) -> AnalysisResponse:
    """
    Request -> Validation -> Service -> Response.

    This route does NOT parse the resume, run NLP, or compute a score —
    all of that lives in `analysis_service.analyze_resume`, which can be
    swapped for the real NLP/DSA engine without touching this route.
    """

    try:
        validate_resume_file(resume, settings)
        validate_job_description(job_description, settings)
    except ValidationError as exc:
        message = str(exc)
        if "too large" in message:
            status_code = status.HTTP_413_CONTENT_TOO_LARGE
        elif "Unsupported file type" in message:
            status_code = status.HTTP_415_UNSUPPORTED_MEDIA_TYPE
        else:
            status_code = status.HTTP_400_BAD_REQUEST
        raise HTTPException(status_code=status_code, detail=message) from exc

    return await analysis_service.analyze_resume(resume, job_description)
