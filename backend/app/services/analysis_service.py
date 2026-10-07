from app.services.nlp_service import analyze_resume as nlp_analyze

from io import BytesIO

from fastapi import HTTPException, UploadFile
from docx import Document
from pypdf import PdfReader

from app.schemas.analyze import AnalysisResponse
from app.services.nlp_service import analyze_resume as nlp_analyze


async def extract_resume_text(resume: UploadFile) -> str:
    file_data = await resume.read()

    if not file_data:
        raise HTTPException(
            status_code=400,
            detail="Resume file is empty"
        )

    filename = (resume.filename or "").lower()

    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(BytesIO(file_data))

            text = "\n".join(
                page.extract_text() or ""
                for page in reader.pages
            )

        elif filename.endswith(".docx"):
            document = Document(BytesIO(file_data))

            text = "\n".join(
                paragraph.text
                for paragraph in document.paragraphs
            )

        elif filename.endswith(".txt"):
            text = file_data.decode("utf-8")

        else:
            raise HTTPException(
                status_code=415,
                detail="Unsupported resume file type"
            )

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from resume"
        )

    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="No readable text found in resume"
        )

    return text


async def analyze_resume(
    resume: UploadFile,
    job_description: str
) -> AnalysisResponse:

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty"
        )

    resume_text = await extract_resume_text(resume)

    result = nlp_analyze(
        resume_text,
        job_description
    )

    job_skills = result["job_skills"]
    matched_skills = result["matched_skills"]

    skill_score = (
        len(matched_skills)
        / len(job_skills)
        * 100
        if job_skills
        else 0
    )

    keyword_score = result[
        "keyword_match_percentage"
    ]

    ats_score = (
        skill_score * 0.6
        + keyword_score * 0.4
    )

    return AnalysisResponse(
        ats_score=round(ats_score, 2),

        matched_skills=matched_skills,

        missing_skills=result[
            "missing_skills"
        ],

        keyword_match_percentage=keyword_score,

        experience_match=False,

        education_match=False,

        suggestions_context={
            "resume_filename": resume.filename,
            "resume_skills": result[
                "resume_skills"
            ],
            "job_skills": result[
                "job_skills"
            ]
        }
    )
