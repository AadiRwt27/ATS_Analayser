"""
Centralised, environment-driven configuration for the API layer.

Nothing in this file should be hard-coded that could differ between
environments (dev / staging / prod) — URLs, limits and secrets all come
from environment variables (loaded from a `.env` file in development).
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- General ---
    app_name: str = "Resume ATS Analyzer API"
    environment: str = "development"

    # --- CORS ---
    # Comma-separated list of allowed origins, e.g.
    # "http://localhost:5173,https://resume-ats-analyzer.example.com"
    frontend_url: str = "http://localhost:5173"

    # --- Upload limits ---
    max_upload_size_mb: int = 5
    allowed_resume_extensions: str = ".pdf,.docx"
    allowed_resume_content_types: str = (
        "application/pdf,"
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )

    # --- Job description limits ---
    max_job_description_length: int = 5000

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def max_upload_size_bytes(self) -> int:
        return self.max_upload_size_mb * 1024 * 1024

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.frontend_url.split(",") if origin.strip()]

    @property
    def allowed_extensions_list(self) -> list[str]:
        return [ext.strip().lower() for ext in self.allowed_resume_extensions.split(",")]

    @property
    def allowed_content_types_list(self) -> list[str]:
        return [ct.strip() for ct in self.allowed_resume_content_types.split(",")]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — read once, reused everywhere via DI."""
    return Settings()
