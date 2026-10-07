from unittest.mock import AsyncMock, patch


@patch("app.services.analysis_service.extract_resume_text", new_callable=AsyncMock)
def test_analyze_success(mock_extract, client, valid_pdf_bytes):
    mock_extract.return_value = "Python developer with FastAPI experience."
    response = client.post(
        "/api/analyze",
        files={"resume": ("resume.pdf", valid_pdf_bytes, "application/pdf")},
        data={"job_description": "Looking for a Python developer with FastAPI experience."},
    )
    assert response.status_code == 200
    body = response.json()
    assert 0 <= body["ats_score"] <= 100
    assert isinstance(body["matched_skills"], list)
    assert isinstance(body["missing_skills"], list)
    assert "keyword_match_percentage" in body


def test_analyze_missing_resume(client):
    response = client.post(
        "/api/analyze",
        data={"job_description": "Some job description."},
    )
    # FastAPI returns 422 when a required multipart field is absent entirely.
    assert response.status_code == 422


def test_analyze_invalid_file_type(client):
    response = client.post(
        "/api/analyze",
        files={"resume": ("resume.exe", b"not a resume", "application/octet-stream")},
        data={"job_description": "Some job description."},
    )
    assert response.status_code == 415
    assert response.json()["detail"] == "Unsupported file type."


def test_analyze_empty_job_description(client, valid_pdf_bytes):
    response = client.post(
        "/api/analyze",
        files={"resume": ("resume.pdf", valid_pdf_bytes, "application/pdf")},
        data={"job_description": "   "},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Job description cannot be empty."


def test_analyze_oversized_file(client):
    settings_max_bytes = 5 * 1024 * 1024
    oversized = b"a" * (settings_max_bytes + 1)
    response = client.post(
        "/api/analyze",
        files={"resume": ("resume.pdf", oversized, "application/pdf")},
        data={"job_description": "Some job description."},
    )
    assert response.status_code == 413
    assert "too large" in response.json()["detail"]


def test_analyze_invalid_request_body_missing_job_description_field(client, valid_pdf_bytes):
    response = client.post(
        "/api/analyze",
        files={"resume": ("resume.pdf", valid_pdf_bytes, "application/pdf")},
    )
    assert response.status_code == 422
