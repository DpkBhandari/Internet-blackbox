from pydantic import BaseModel, Field, validator, HttpUrl
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum


# ── Enums ──────────────────────────────────────────────────────────
class ContentCategory(str, Enum):
    POLITICS = "Politics"
    HEALTH = "Health"
    TECHNOLOGY = "Technology"
    ENTERTAINMENT = "Entertainment"
    EDUCATION = "Education"
    ECONOMY = "Economy"
    ENVIRONMENT = "Environment"
    SCIENCE = "Science"
    SPORTS = "Sports"
    GENERAL = "General"


class SentimentLabel(str, Enum):
    POSITIVE = "positive"
    NEGATIVE = "negative"
    NEUTRAL = "neutral"


class ViralityLevel(str, Enum):
    VIRAL = "VIRAL"
    TRENDING = "TRENDING"
    RISING = "RISING"
    STABLE = "STABLE"


class MisinfoType(str, Enum):
    HEALTH = "health_misinfo"
    POLITICAL = "political_misinfo"
    TECHNOLOGY = "technology_misinfo"
    CONSPIRACY = "conspiracy"
    SATIRE = "satire"
    FABRICATED = "fabricated"
    MISLEADING = "misleading"
    UNKNOWN = "unknown"


# ── Base text input ────────────────────────────────────────────────
class TextInput(BaseModel):
    text: str = Field(..., min_length=5, max_length=100_000, description="Text to analyze")
    language: str = Field(default="en", description="ISO language code")
    source: Optional[str] = Field(default=None, description="Content source (twitter, reddit, etc)")
    metadata: Optional[Dict[str, Any]] = Field(default=None, description="Optional extra metadata")

    @validator("text")
    def strip_text(cls, v: str) -> str:
        return v.strip()


# ── Sentiment ──────────────────────────────────────────────────────
class SentimentRequest(TextInput):
    include_emotions: bool = Field(default=True, description="Include emotion breakdown")
    include_aspects: bool = Field(default=False, description="Aspect-based sentiment (slower)")


# ── Batch analysis ─────────────────────────────────────────────────
class BatchTextItem(BaseModel):
    id: Optional[str] = None
    text: str = Field(..., min_length=5, max_length=100_000)
    language: str = "en"
    metadata: Optional[Dict[str, Any]] = None

    @validator("text")
    def strip_text(cls, v: str) -> str:
        return v.strip()


class BatchAnalyzeRequest(BaseModel):
    items: List[BatchTextItem] = Field(..., min_items=1, max_items=500)
    include_sentiment: bool = True
    include_misinfo: bool = True
    include_virality: bool = True
    include_topics: bool = True
    include_ner: bool = False
    async_mode: bool = Field(default=False, description="Return job_id immediately instead of waiting")
    priority: Literal["low", "normal", "high"] = "normal"


# ── Full analysis ──────────────────────────────────────────────────
class FullAnalyzeRequest(TextInput):
    url: Optional[str] = Field(default=None, description="URL to scrape if no text provided")
    include_sentiment: bool = True
    include_misinfo: bool = True
    include_virality: bool = True
    include_topics: bool = True
    include_ner: bool = True
    include_keywords: bool = True
    include_readability: bool = True

    @validator("text", always=True)
    def text_or_url(cls, v, values):
        if not v and not values.get("url"):
            raise ValueError("Either text or url must be provided")
        return v or ""


# ── Trend detection ────────────────────────────────────────────────
class TimeSeriesPoint(BaseModel):
    timestamp: datetime
    value: float
    label: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class TrendDetectRequest(BaseModel):
    series: List[TimeSeriesPoint] = Field(
        ..., min_items=3,
        description="Time-series data points to analyze for viral spikes"
    )
    metric: str = Field(default="shares", description="What metric is being tracked")
    sensitivity: float = Field(default=2.0, ge=0.5, le=5.0, description="Spike detection sensitivity (z-score threshold)")
    window_size: int = Field(default=5, ge=2, le=50, description="Rolling window for baseline")
    topic: Optional[str] = Field(default=None, description="Topic label for context")


# ── Topic classification ───────────────────────────────────────────
class TopicClassifyRequest(TextInput):
    top_k: int = Field(default=3, ge=1, le=10, description="Number of top categories to return")
    threshold: float = Field(default=0.1, ge=0.0, le=1.0, description="Minimum confidence threshold")
    custom_categories: Optional[List[str]] = Field(
        default=None, description="Override default categories"
    )


# ── Misinformation detection ───────────────────────────────────────
class MisinfoDetectRequest(TextInput):
    url: Optional[str] = Field(default=None, description="Source URL for credibility check")
    check_source_credibility: bool = Field(default=True)
    check_emotional_manipulation: bool = Field(default=True)
    check_factual_claims: bool = Field(default=False, description="Experimental fact-check")


# ── Web data fetching ──────────────────────────────────────────────
class FetchWebDataRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=500, description="Search query")
    source: Literal["newsapi", "gnews", "guardian", "rss", "scrape"] = "newsapi"
    category: Optional[ContentCategory] = None
    language: str = "en"
    page_size: int = Field(default=10, ge=1, le=100)
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    analyze: bool = Field(default=True, description="Auto-analyze fetched content")


# ── NER ───────────────────────────────────────────────────────────
class NERRequest(TextInput):
    entity_types: Optional[List[str]] = Field(
        default=None,
        description="Filter entity types: PERSON, ORG, GPE, DATE, etc."
    )


# ── Job status ────────────────────────────────────────────────────
class JobStatusRequest(BaseModel):
    job_id: str


# ── Health ────────────────────────────────────────────────────────
class PingRequest(BaseModel):
    message: Optional[str] = "ping"
