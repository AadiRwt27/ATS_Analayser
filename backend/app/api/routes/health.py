from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health", summary="Health check")
async def health_check() -> dict:
    """Simple liveness check used by uptime monitors / load balancers."""
    return {"status": "ok"}
