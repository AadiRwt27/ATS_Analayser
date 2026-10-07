"""
Upload validation helpers.

Kept separate from the route so `analyze.py` stays thin, and so the same
checks can be reused by tests without spinning up the full app.
"""

import os
from pathlib import PurePosixPath

from fastapi import UploadFile

from app.core.config import Settings


class ValidationError(Exception):
    """Raised with a user-facing message; caught and turned into a 400/413 by the route."""


def safe_filename(filename: str | None) -> str:
    """
    Never trust the uploaded filename. Strip any path components so it
    can't be used for path traversal if it's ever persisted to disk.
    """
    if not filename:
        return "resume"
    return PurePosixPath(filename).name


def validate_resume_file(resume: UploadFile | None, settings: Settings) -> None:
    if resume is None or not resume.filename:
        raise ValidationError("Resume file is required.")

    filename = safe_filename(resume.filename)
    extension = os.path.splitext(filename)[1].lower()

    if extension not in settings.allowed_extensions_list:
        raise ValidationError("Unsupported file type.")

    if resume.content_type and resume.content_type not in settings.allowed_content_types_list:
        raise ValidationError("Unsupported file type.")

    # UploadFile.size is computed by Starlette from the underlying spooled
    # file (seek/tell), not by the app reading the stream — so this does
    # not count as "reading the file" for performance purposes.
    if resume.size is not None and resume.size > settings.max_upload_size_bytes:
        raise ValidationError(
            f"Resume file is too large. Max size is {settings.max_upload_size_mb}MB."
        )


def validate_job_description(job_description: str | None, settings: Settings) -> None:
    if job_description is None or not job_description.strip():
        raise ValidationError("Job description cannot be empty.")

    if len(job_description) > settings.max_job_description_length:
        raise ValidationError(
            f"Job description exceeds the {settings.max_job_description_length} character limit."
        )
