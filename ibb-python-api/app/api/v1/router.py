from fastapi import APIRouter
from app.api.v1.endpoints.sentiment import router as sentiment_router
from app.api.v1.endpoints.trend import router as trend_router
from app.api.v1.endpoints.topic import router as topic_router
from app.api.v1.endpoints.misinfo import router as misinfo_router
from app.api.v1.endpoints.scraper import router as scraper_router
from app.api.v1.endpoints.extras import (
    batch_router, analyze_router, ner_router, health_router
)

api_router = APIRouter(prefix="/api/v1")

# Core NLP endpoints
api_router.include_router(sentiment_router)
api_router.include_router(trend_router)
api_router.include_router(topic_router)
api_router.include_router(misinfo_router)
api_router.include_router(scraper_router)

# Advanced endpoints
api_router.include_router(analyze_router)
api_router.include_router(batch_router)
api_router.include_router(ner_router)
api_router.include_router(health_router)
