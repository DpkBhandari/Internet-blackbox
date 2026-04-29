from fastapi import APIRouter, Request
from app.schemas.requests import TopicClassifyRequest
from app.schemas.responses import TopicResponse, ErrorResponse
from app.services.topic.topic_service import topic_service
from app.core.cache import cache, make_cache_key
from app.core.security import limiter

router = APIRouter(prefix="/classify-topic", tags=["Topic Classification"])


@router.post(
    "",
    response_model=TopicResponse,
    responses={422: {"model": ErrorResponse}},
    summary="Classify content into topic categories",
    description=(
        "Classifies text into predefined categories: Politics, Health, Technology, "
        "Economy, Environment, Science, Sports, Entertainment, Education, General. "
        "Uses zero-shot classification (BART-large-mnli) with keyword TF-IDF fallback."
    ),
)
@limiter.limit("60/minute")
async def classify_topic(
    request: Request,
    body: TopicClassifyRequest,
):
    cache_key = f"topic:{make_cache_key(body.text, body.top_k, body.threshold)}"
    cached = await cache.get(cache_key)
    if cached:
        cached["cached"] = True
        return cached

    result = await topic_service.classify(
        text=body.text,
        top_k=body.top_k,
        threshold=body.threshold,
        custom_categories=body.custom_categories,
    )

    await cache.set(cache_key, result.model_dump(), ttl=600)
    return result
