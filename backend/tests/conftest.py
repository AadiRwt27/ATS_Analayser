import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture()
def valid_pdf_bytes() -> bytes:
    # Minimal content is fine — the API layer only checks type/size, it
    # never parses the file itself.
    return b"%PDF-1.4 fake resume content for testing"
