from fastapi import APIRouter, Request
from app.schemas.requests import TrendDetectRequest
from app.schemas.responses import TrendDetectResponse, ErrorResponse
from app.services.trend.trend_service import trend_service
from app.core.security import limiter

router = APIRouter(prefix="/detect-trend", tags=["Viral Trend Detection"])


@router.post(
    "",
    response_model=TrendDetectResponse,
    responses={422: {"model": ErrorResponse}},
    summary="Detect viral trends from time-series data",
    description=(
        "Analyzes a time-series of content metrics (shares, views, engagement) "
        "to detect viral spikes using modified Z-score detection. "
        "Returns spike events, virality level (VIRAL/TRENDING/RISING/STABLE), "
        "trend metrics, and a 3-step forward projection."
    ),
)
@limiter.limit("30/minute")
async def detect_trend(
    request: Request,
    body: TrendDetectRequest,
):
    return await trend_service.detect(
        series=body.series,
        metric=body.metric,
        sensitivity=body.sensitivity,
        window_size=body.window_size,
        topic=body.topic,
    )
