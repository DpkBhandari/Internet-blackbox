"""
Batch Processing, Full Analysis, and Health endpoints.
"""

from fastapi import APIRouter, Request, HTTPException
from loguru import logger
import time
import asyncio
from datetime import datetime

from app.schemas.requests import (
    BatchAnalyzeRequest, FullAnalyzeRequest, JobStatusRequest, NERRequest
)
from app.schemas.responses import (
    BatchResponse, FullAnalysisResponse, JobStatusResponse,
    HealthResponse, ModelStatus, NERResponse, ErrorResponse
)
from app.services.nlp.sentiment_service import sentiment_service
from app.services.nlp.ner_service import ner_service
from app.services.misinfo.misinfo_service import misinfo_service
from app.services.topic.topic_service import topic_service
from app.services.trend.trend_service import trend_service
from app.services.batch.batch_service import batch_service
from app.services.nlp.model_manager import model_manager
from app.core.cache import cache
from app.core.security import limiter
from app.core.config import settings
from app.utils.text_utils import (
    word_count, flesch_kincaid_grade, toxicity_score_heuristic, summarize_text
)

# ── Batch router ───────────────────────────────────────────────────
batch_router = APIRouter(prefix="/batch", tags=["Batch Processing"])

@batch_router.post(
    "/analyze",
    response_model=BatchResponse,
    summary="Batch analyze multiple texts",
    description=(
        "Process 1–500 texts in a single request. Each item can include "
        "sentiment, misinfo, virality, and topic analysis. "
        "Set async_mode=true to get a job_id immediately for large batches."
    ),
)
@limiter.limit("10/minute")
async def batch_analyze(request: Request, body: BatchAnalyzeRequest):
    return await batch_service.process(
        items=body.items,
        include_sentiment=body.include_sentiment,
        include_misinfo=body.include_misinfo,
        include_virality=body.include_virality,
        include_topics=body.include_topics,
        async_mode=body.async_mode,
        priority=body.priority,
    )


@batch_router.get(
    "/job/{job_id}",
    response_model=JobStatusResponse,
    summary="Get async batch job status",
)
async def get_job_status(job_id: str):
    job = batch_service.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job {job_id} not found")

    return JobStatusResponse(
        job_id=job_id,
        status=job.get("status", "UNKNOWN"),
        progress=job.get("progress", 0),
        result=job.get("result"),
        error=job.get("error"),
        created_at=datetime.utcfromtimestamp(job["created_at"]) if job.get("created_at") else None,
        completed_at=datetime.utcfromtimestamp(job["completed_at"]) if job.get("completed_at") else None,
    )


# ── Full analysis router ───────────────────────────────────────────
analyze_router = APIRouter(prefix="/analyze", tags=["Full Analysis"])

@analyze_router.post(
    "",
    response_model=FullAnalysisResponse,
    summary="Full NLP pipeline analysis",
    description=(
        "Complete analysis pipeline: sentiment + emotions, misinfo detection, "
        "virality estimation, topic classification, NER, keyword extraction, "
        "readability scoring, and toxicity. "
        "Most comprehensive but slowest endpoint (~200-800ms)."
    ),
)
@limiter.limit("30/minute")
async def full_analyze(request: Request, body: FullAnalyzeRequest):
    start = time.time()
    text = body.text.strip()

    if not text and body.url:
        from app.services.scraper.scraper_service import scraper_service
        article = await scraper_service._scrape_url(str(body.url))
        if article and article.content_preview:
            text = f"{article.title or ''} {article.content_preview}".strip()
        if not text:
            raise HTTPException(400, "Could not extract text from URL")

    if not text:
        raise HTTPException(400, "Provide text or a valid URL")

    # Run all analyses concurrently
    tasks = {}
    if body.include_sentiment:
        tasks["sentiment"] = sentiment_service.analyze(text, include_emotions=True)
    if body.include_misinfo:
        tasks["misinfo"] = misinfo_service.analyze(text, url=str(body.url) if body.url else None)
    if body.include_topics:
        tasks["topic"] = topic_service.classify(text, top_k=3)
    if body.include_ner:
        tasks["ner"] = ner_service.extract(text)

    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    result_map = dict(zip(tasks.keys(), results))

    # Sentiment
    sentiment_result = result_map.get("sentiment")
    if isinstance(sentiment_result, Exception):
        logger.error(f"Sentiment failed: {sentiment_result}")
        sentiment_result = None

    # Misinfo
    misinfo_result = result_map.get("misinfo")
    misinfo_data = {}
    if misinfo_result and not isinstance(misinfo_result, Exception):
        misinfo_data = {
            "flagged": misinfo_result.flagged,
            "confidence": misinfo_result.confidence,
            "risk_level": misinfo_result.risk_level,
            "type": misinfo_result.misinfo_type,
            "signals_count": len(misinfo_result.signals),
        }

    # Topic
    topic_result = result_map.get("topic")
    topic_data = {}
    if topic_result and not isinstance(topic_result, Exception):
        topic_data = {
            "top_topic": topic_result.top_topic,
            "confidence": topic_result.top_confidence,
            "all_topics": [t.model_dump() for t in topic_result.all_topics],
        }

    # NER
    ner_result = result_map.get("ner")
    entities = []
    keywords = []
    if ner_result and not isinstance(ner_result, Exception):
        entities = ner_result.entities
        keywords = ner_result.keywords
    else:
        from app.utils.text_utils import clean_text
        import re
        words = re.findall(r"\b[a-zA-Z]{4,}\b", text.lower())
        freq: dict = {}
        for w in words:
            freq[w] = freq.get(w, 0) + 1
        keywords = sorted(freq, key=freq.get, reverse=True)[:10]  # type: ignore

    # Virality estimate from sentiment
    virality_score = 0
    virality_level = "STABLE"
    if sentiment_result:
        abs_s = abs(sentiment_result.score)
        wc = word_count(text)
        raw = abs_s * 50 + min(25, wc / 20) + (20 if misinfo_data.get("flagged") else 0)
        virality_score = int(min(100, raw))
        virality_level = (
            "VIRAL" if virality_score >= 90 else
            "TRENDING" if virality_score >= 70 else
            "RISING" if virality_score >= 50 else "STABLE"
        )

    # Optional extras
    readability = flesch_kincaid_grade(text) if body.include_readability else None
    toxicity = toxicity_score_heuristic(text)
    summary = summarize_text(text) if len(text.split()) > 80 else None
    language = body.language or "en"

    elapsed = round((time.time() - start) * 1000, 1)
    logger.info(f"Full analysis completed in {elapsed}ms | words={word_count(text)}")

    return FullAnalysisResponse(
        text_preview=text[:200] + "..." if len(text) > 200 else text,
        word_count=word_count(text),
        language=language,
        readability_grade=readability,
        sentiment=sentiment_result,
        virality={"score": virality_score, "level": virality_level},
        misinfo=misinfo_data,
        topic=topic_data,
        keywords=keywords,
        entities=entities,
        toxicity=toxicity,
        summary=summary,
        processing_time_ms=elapsed,
    )


# ── NER router ─────────────────────────────────────────────────────
ner_router = APIRouter(prefix="/extract-entities", tags=["NER & Keywords"])

@ner_router.post(
    "",
    response_model=NERResponse,
    summary="Extract named entities and keywords",
)
@limiter.limit("60/minute")
async def extract_entities(request: Request, body: NERRequest):
    return await ner_service.extract(body.text, body.entity_types)


# ── Health router ──────────────────────────────────────────────────
health_router = APIRouter(tags=["Health & System"])
_start_time = time.time()

@health_router.get(
    "/health",
    response_model=HealthResponse,
    summary="Full system health check",
)
async def health_check():
    redis_ok = await cache.ping()
    model_status = model_manager.get_status()

    models = [
        ModelStatus(
            name="sentiment-transformer",
            status="loaded" if model_status["models"]["sentiment"]["loaded"] else "fallback",
            loaded=model_status["models"]["sentiment"]["loaded"],
            version=settings.sentiment_model,
            device=model_status["device"],
            latency_ms=model_status["models"]["sentiment"].get("load_time_ms"),
        ),
        ModelStatus(
            name="zero-shot-topic",
            status="loaded" if model_status["models"]["zero_shot"]["loaded"] else "fallback",
            loaded=model_status["models"]["zero_shot"]["loaded"],
            version=settings.topic_model,
        ),
        ModelStatus(
            name="spacy-ner",
            status="loaded" if model_status["models"]["spacy"]["loaded"] else "fallback",
            loaded=model_status["models"]["spacy"]["loaded"],
            version=settings.ner_model,
        ),
    ]

    return HealthResponse(
        status="ok" if redis_ok else "degraded",
        version=settings.app_version,
        environment=settings.environment,
        uptime_seconds=round(time.time() - _start_time, 1),
        models=models,
        services={
            "redis": "connected" if redis_ok else "unavailable",
            "sentiment_engine": "transformer" if model_status["models"]["sentiment"]["loaded"] else "vader_fallback",
            "topic_engine": "zero_shot" if model_status["models"]["zero_shot"]["loaded"] else "keyword_fallback",
            "ner_engine": "spacy" if model_status["models"]["spacy"]["loaded"] else "regex_fallback",
        },
    )


@health_router.get("/health/ready", summary="Kubernetes readiness probe")
async def readiness():
    return {"ready": True, "timestamp": datetime.utcnow()}


@health_router.get("/health/live", summary="Kubernetes liveness probe")
async def liveness():
    return {"alive": True, "timestamp": datetime.utcnow()}


@health_router.get("/models", summary="List loaded models and their status")
async def list_models():
    return {
        "success": True,
        "data": model_manager.get_status(),
        "available_models": {
            "sentiment": settings.sentiment_model,
            "topic": settings.topic_model,
            "ner": settings.ner_model,
            "misinfo": settings.misinfo_model,
        },
    }
