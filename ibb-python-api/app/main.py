"""
Internet Black Box — Python AI Service
FastAPI application factory with lifespan management.
"""

import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from loguru import logger

from app.core.config import settings
from app.core.logging import setup_logging
from app.core.cache import cache
from app.core.security import limiter
from app.middleware.logging_middleware import RequestLoggingMiddleware
from app.api.v1.router import api_router


# ── Lifespan (startup + shutdown) ─────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage startup and shutdown events."""
    setup_logging()
    logger.info("=" * 60)
    logger.info(f"  {settings.app_name} v{settings.app_version}")
    logger.info(f"  Environment : {settings.environment}")
    logger.info(f"  Device      : {settings.torch_device}")
    logger.info("=" * 60)

    # Connect cache
    await cache.connect()

    # Preload models (optional — comment out for faster cold start)
    if settings.is_prod:
        logger.info("Production mode: preloading NLP models...")
        from app.services.nlp.model_manager import model_manager
        model_manager.preload_all()
    else:
        logger.info("Dev mode: models will load on first request (lazy)")

    logger.info("✅ Startup complete — API ready")
    yield

    # Shutdown
    logger.info("Shutting down...")
    await cache.disconnect()
    logger.info("Cache disconnected. Goodbye.")


# ── App factory ────────────────────────────────────────────────────
def create_app() -> FastAPI:
    app = FastAPI(
        title="Internet Black Box — AI/NLP Service",
        description=(
            "Production-ready NLP API for sentiment analysis, viral trend detection, "
            "misinformation flagging, topic classification, web data fetching, "
            "named entity recognition, and batch processing.\n\n"
            "**Node.js Backend Integration**: Pass `X-API-Key: ibb_ai_internal_key` header.\n\n"
            "**Model Stack**: HuggingFace Transformers (DistilBERT/BART) + spaCy + NLTK VADER."
        ),
        version=settings.app_version,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
        contact={"name": "IBB Team", "email": "deepak@interndrive.in"},
        license_info={"name": "MIT"},
    )

    # ── Rate limiter state ─────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Middleware stack (order matters — outermost first) ─────────
    app.add_middleware(RequestLoggingMiddleware)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-API-Key", "X-Request-ID"],
    )

    app.add_middleware(GZipMiddleware, minimum_size=1000)

    if settings.is_prod:
        app.add_middleware(
            TrustedHostMiddleware,
            allowed_hosts=settings.allowed_hosts_list + ["*"],
        )

    # ── Prometheus metrics ─────────────────────────────────────────
    try:
        from prometheus_fastapi_instrumentator import Instrumentator
        Instrumentator(
            should_group_status_codes=True,
            should_ignore_untemplated=True,
            should_respect_env_var=True,
            env_var_name="ENABLE_METRICS",
            excluded_handlers=["/health", "/health/ready", "/health/live"],
        ).instrument(app).expose(app, endpoint="/metrics")
        logger.info("Prometheus metrics enabled at /metrics")
    except ImportError:
        logger.warning("prometheus_fastapi_instrumentator not installed — metrics disabled")

    # ── Routes ────────────────────────────────────────────────────
    app.include_router(api_router)

    # ── Root redirect ─────────────────────────────────────────────
    @app.get("/", include_in_schema=False)
    async def root():
        return {
            "service": settings.app_name,
            "version": settings.app_version,
            "docs": "/docs",
            "health": "/api/v1/health",
            "endpoints": {
                "sentiment":  "POST /api/v1/analyze-sentiment",
                "trend":      "POST /api/v1/detect-trend",
                "topic":      "POST /api/v1/classify-topic",
                "misinfo":    "POST /api/v1/detect-misinformation",
                "web_data":   "POST /api/v1/fetch-web-data",
                "full":       "POST /api/v1/analyze",
                "batch":      "POST /api/v1/batch/analyze",
                "ner":        "POST /api/v1/extract-entities",
                "job_status": "GET  /api/v1/batch/job/{job_id}",
            },
        }

    # ── Global exception handler ───────────────────────────────────
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled error: {exc}", exc_info=True)
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "error": "Internal server error",
                "detail": str(exc) if settings.is_dev else "Contact support",
            },
        )

    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(
            status_code=404,
            content={"success": False, "error": f"Route {request.url.path} not found"},
        )

    return app


app = create_app()
