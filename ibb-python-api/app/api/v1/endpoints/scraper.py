from fastapi import APIRouter, Request
from app.schemas.requests import FetchWebDataRequest
from app.schemas.responses import WebDataResponse, ErrorResponse, FullAnalysisResponse
from app.services.scraper.scraper_service import scraper_service
from app.services.nlp.sentiment_service import sentiment_service
from app.services.misinfo.misinfo_service import misinfo_service
from app.services.topic.topic_service import topic_service
from app.core.security import limiter
from loguru import logger
import asyncio

router = APIRouter(prefix="/fetch-web-data", tags=["Web Data Fetching"])


@router.post(
    "",
    response_model=WebDataResponse,
    responses={422: {"model": ErrorResponse}},
    summary="Fetch and optionally analyze web content",
    description=(
        "Fetches news articles or web content via NewsAPI, GNews, RSS feeds, "
        "or direct URL scraping. Optionally auto-analyzes fetched content "
        "(sentiment + misinfo + topic) before returning."
    ),
)
@limiter.limit("20/minute")
async def fetch_web_data(
    request: Request,
    body: FetchWebDataRequest,
):
    result = await scraper_service.fetch(
        query=body.query,
        source=body.source,
        category=body.category.value if body.category else None,
        language=body.language,
        page_size=body.page_size,
        from_date=body.from_date,
        to_date=body.to_date,
    )

    # Auto-analyze articles if requested
    if body.analyze and result.articles:
        logger.info(f"Auto-analyzing {len(result.articles)} fetched articles")

        async def analyze_article(article):
            text = " ".join(filter(None, [
                article.title,
                article.description,
                article.content_preview,
            ]))
            if len(text.split()) < 5:
                return

            try:
                sentiment, misinfo, topic = await asyncio.gather(
                    sentiment_service.analyze(text, include_emotions=False),
                    misinfo_service.analyze(text),
                    topic_service.classify(text, top_k=1),
                    return_exceptions=True,
                )
                article.analysis = {
                    "sentiment": {
                        "label": sentiment.label if not isinstance(sentiment, Exception) else None,
                        "score": sentiment.score if not isinstance(sentiment, Exception) else None,
                        "confidence": sentiment.confidence if not isinstance(sentiment, Exception) else None,
                    },
                    "misinfo_flagged": misinfo.flagged if not isinstance(misinfo, Exception) else None,
                    "misinfo_confidence": misinfo.confidence if not isinstance(misinfo, Exception) else None,
                    "top_topic": topic.top_topic if not isinstance(topic, Exception) else None,
                }
            except Exception as e:
                logger.warning(f"Article analysis failed: {e}")

        await asyncio.gather(*[analyze_article(a) for a in result.articles])
        result.analyzed = True

    return result
