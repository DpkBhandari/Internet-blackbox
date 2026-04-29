from fastapi import APIRouter, Depends, Request
from loguru import logger
from app.schemas.requests import SentimentRequest
from app.schemas.responses import SentimentResponse, ErrorResponse
from app.services.nlp.sentiment_service import sentiment_service
from app.core.cache import cache, make_cache_key
from app.core.security import limiter
from app.utils.text_utils import word_count, flesch_kincaid_grade

router = APIRouter(prefix="/analyze-sentiment", tags=["Sentiment Analysis"])


@router.post(
    "",
    response_model=SentimentResponse,
    responses={422: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
    summary="Analyze sentiment of text",
    description=(
        "Performs multi-layer sentiment analysis using HuggingFace transformers "
        "(DistilBERT/RoBERTa) with NLTK VADER fallback. Returns polarity score, "
        "label, confidence, emotion breakdown, and subjectivity."
    ),
)
@limiter.limit("60/minute")
async def analyze_sentiment(
    request: Request,
    body: SentimentRequest,
):
    # Check cache first
    cache_key = f"sentiment:{make_cache_key(body.text, body.include_emotions, body.language)}"
    cached = await cache.get(cache_key)
    if cached:
        logger.debug(f"Sentiment cache hit")
        cached["cached"] = True
        return cached

    result = await sentiment_service.analyze(
        text=body.text,
        include_emotions=body.include_emotions,
        language=body.language,
    )

    response = SentimentResponse(
        text_preview=body.text[:200] + "..." if len(body.text) > 200 else body.text,
        word_count=word_count(body.text),
        sentiment=result,
        processing_time_ms=result.model_fields_set and 0 or 0,
    )

    await cache.set(cache_key, response.model_dump(), ttl=300)
    return response
