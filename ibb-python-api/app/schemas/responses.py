from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Generic, TypeVar
from datetime import datetime
from enum import Enum

T = TypeVar("T")


# ── Base response wrapper ──────────────────────────────────────────
class BaseResponse(BaseModel):
    success: bool = True
    processed_at: datetime = Field(default_factory=datetime.utcnow)
    processing_time_ms: Optional[float] = None
    model_version: str = "v2.0"
    cached: bool = False


class ErrorResponse(BaseModel):
    success: bool = False
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
    processed_at: datetime = Field(default_factory=datetime.utcnow)


# ── Sentiment responses ────────────────────────────────────────────
class EmotionBreakdown(BaseModel):
    joy: float = 0.0
    anger: float = 0.0
    fear: float = 0.0
    sadness: float = 0.0
    surprise: float = 0.0
    disgust: float = 0.0
    trust: float = 0.0
    anticipation: float = 0.0


class SentimentResult(BaseModel):
    score: float = Field(..., ge=-1.0, le=1.0, description="Polarity score: -1 (negative) to +1 (positive)")
    label: str = Field(..., description="positive / negative / neutral")
    confidence: float = Field(..., ge=0.0, le=1.0)
    positive_prob: float = 0.0
    negative_prob: float = 0.0
    neutral_prob: float = 0.0
    emotions: Optional[EmotionBreakdown] = None
    subjectivity: float = Field(default=0.0, ge=0.0, le=1.0, description="0=objective, 1=subjective")


class SentimentResponse(BaseResponse):
    text_preview: str
    word_count: int
    sentiment: SentimentResult


# ── Trend detection responses ──────────────────────────────────────
class SpikePoint(BaseModel):
    timestamp: datetime
    value: float
    zscore: float
    baseline: float
    spike_ratio: float = Field(description="value / baseline")
    severity: str = Field(description="LOW / MEDIUM / HIGH / CRITICAL")


class TrendMetrics(BaseModel):
    mean: float
    std: float
    min: float
    max: float
    trend_direction: str = Field(description="RISING / FALLING / STABLE / VOLATILE")
    trend_slope: float
    coefficient_of_variation: float
    autocorrelation: Optional[float] = None


class TrendDetectResponse(BaseResponse):
    topic: Optional[str] = None
    metric: str
    series_length: int
    spikes_detected: int
    spikes: List[SpikePoint]
    virality_level: str = Field(description="VIRAL / TRENDING / RISING / STABLE")
    virality_score: int = Field(ge=0, le=100)
    trend_metrics: TrendMetrics
    prediction: Optional[Dict[str, Any]] = None
    recommendation: str


# ── Topic classification responses ────────────────────────────────
class TopicScore(BaseModel):
    category: str
    confidence: float = Field(ge=0.0, le=1.0)
    rank: int


class TopicResponse(BaseResponse):
    text_preview: str
    top_topic: str
    top_confidence: float
    all_topics: List[TopicScore]
    keywords: List[str]


# ── Misinformation responses ───────────────────────────────────────
class MisinfoSignal(BaseModel):
    signal_type: str
    description: str
    severity: str = Field(description="LOW / MEDIUM / HIGH")
    score: float = Field(ge=0.0, le=1.0)


class CredibilityIndicators(BaseModel):
    uses_sensational_language: bool
    uses_emotional_manipulation: bool
    has_unverified_claims: bool
    contains_conspiracy_keywords: bool
    has_excessive_capitalization: bool
    has_excessive_punctuation: bool
    has_contradictory_statements: bool
    clickbait_score: float


class MisinfoResponse(BaseResponse):
    text_preview: str
    flagged: bool
    confidence: float = Field(ge=0.0, le=1.0)
    misinfo_type: Optional[str] = None
    risk_level: str = Field(description="NONE / LOW / MEDIUM / HIGH / CRITICAL")
    signals: List[MisinfoSignal]
    credibility_indicators: CredibilityIndicators
    recommendation: str
    fact_check_suggested: bool


# ── Web data responses ─────────────────────────────────────────────
class FetchedArticle(BaseModel):
    title: str
    description: Optional[str] = None
    url: Optional[str] = None
    source: str
    published_at: Optional[datetime] = None
    content_preview: Optional[str] = None
    analysis: Optional[Dict[str, Any]] = None


class WebDataResponse(BaseResponse):
    query: str
    source: str
    total_fetched: int
    articles: List[FetchedArticle]
    analyzed: bool


# ── NER responses ─────────────────────────────────────────────────
class NamedEntity(BaseModel):
    text: str
    label: str
    start: int
    end: int
    description: Optional[str] = None


class NERResponse(BaseResponse):
    text_preview: str
    entities: List[NamedEntity]
    entity_counts: Dict[str, int]
    keywords: List[str]


# ── Full analysis response ─────────────────────────────────────────
class FullAnalysisResponse(BaseResponse):
    text_preview: str
    word_count: int
    language: str
    readability_grade: Optional[float] = None
    sentiment: SentimentResult
    virality: Dict[str, Any]
    misinfo: Dict[str, Any]
    topic: Dict[str, Any]
    keywords: List[str]
    entities: List[NamedEntity]
    toxicity: float
    summary: Optional[str] = None


# ── Batch responses ────────────────────────────────────────────────
class BatchItemResult(BaseModel):
    id: Optional[str] = None
    index: int
    success: bool
    error: Optional[str] = None
    sentiment: Optional[SentimentResult] = None
    misinfo_flagged: Optional[bool] = None
    misinfo_confidence: Optional[float] = None
    virality_score: Optional[int] = None
    top_topic: Optional[str] = None
    processing_time_ms: float


class BatchResponse(BaseResponse):
    total: int
    succeeded: int
    failed: int
    results: List[BatchItemResult]
    async_mode: bool = False
    job_id: Optional[str] = None


# ── Health/status responses ────────────────────────────────────────
class ModelStatus(BaseModel):
    name: str
    status: str
    loaded: bool
    version: Optional[str] = None
    device: Optional[str] = None
    latency_ms: Optional[float] = None


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    uptime_seconds: float
    models: List[ModelStatus]
    services: Dict[str, str]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ── Job status responses ───────────────────────────────────────────
class JobStatusResponse(BaseModel):
    job_id: str
    status: str = Field(description="PENDING / PROCESSING / COMPLETED / FAILED")
    progress: int = Field(ge=0, le=100, default=0)
    result: Optional[Any] = None
    error: Optional[str] = None
    created_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
