from fastapi import APIRouter, Request
from app.schemas.requests import MisinfoDetectRequest
from app.schemas.responses import MisinfoResponse, ErrorResponse
from app.services.misinfo.misinfo_service import misinfo_service
from app.core.cache import cache, make_cache_key
from app.core.security import limiter

router = APIRouter(prefix="/detect-misinformation", tags=["Misinformation Detection"])


@router.post(
    "",
    response_model=MisinfoResponse,
    responses={422: {"model": ErrorResponse}},
    summary="Detect potential misinformation in content",
    description=(
        "Multi-layer misinformation detection using: "
        "(1) Conspiracy/misinfo keyword matching across 6 categories, "
        "(2) Linguistic pattern analysis (sensationalism, emotional manipulation), "
        "(3) Source credibility assessment. "
        "Returns confidence score, risk level, and actionable recommendation."
    ),
)
@limiter.limit("60/minute")
async def detect_misinfo(
    request: Request,
    body: MisinfoDetectRequest,
):
    cache_key = f"misinfo:{make_cache_key(body.text, str(body.url))}"
    cached = await cache.get(cache_key)
    if cached:
        cached["cached"] = True
        return cached

    result = await misinfo_service.analyze(
        text=body.text,
        url=str(body.url) if body.url else None,
        check_source=body.check_source_credibility,
        check_emotional=body.check_emotional_manipulation,
    )

    await cache.set(cache_key, result.model_dump(), ttl=600)
    return result
