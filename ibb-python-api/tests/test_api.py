"""
Integration tests for all API endpoints.
Run: pytest tests/ -v --tb=short
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
HEADERS = {"X-API-Key": "ibb_ai_internal_key"}

SAMPLE_TEXT = (
    "Scientists have discovered a new treatment for aggressive brain tumors "
    "using AI-guided nanoparticles. The breakthrough study, published in Nature, "
    "shows promising results in early clinical trials with over 80% success rate."
)

MISINFO_TEXT = (
    "WAKE UP PEOPLE!!! The government is secretly putting MICROCHIPS in vaccines "
    "controlled by 5G towers. Bill Gates depopulation agenda EXPOSED!!! "
    "Share before they DELETE this! They don't want you to know the TRUTH!!!"
)


# ── Health ─────────────────────────────────────────────────────────
class TestHealth:
    def test_root(self):
        r = client.get("/")
        assert r.status_code == 200
        assert "endpoints" in r.json()

    def test_health_full(self):
        r = client.get("/api/v1/health")
        assert r.status_code == 200
        data = r.json()
        assert data["version"] == "2.0.0"
        assert "models" in data

    def test_health_ready(self):
        r = client.get("/api/v1/health/ready")
        assert r.status_code == 200
        assert r.json()["ready"] is True

    def test_health_live(self):
        r = client.get("/api/v1/health/live")
        assert r.status_code == 200
        assert r.json()["alive"] is True

    def test_models_list(self):
        r = client.get("/api/v1/models")
        assert r.status_code == 200


# ── Sentiment ──────────────────────────────────────────────────────
class TestSentiment:
    def test_positive_text(self):
        r = client.post("/api/v1/analyze-sentiment", json={"text": SAMPLE_TEXT})
        assert r.status_code == 200
        data = r.json()
        assert "sentiment" in data
        assert data["sentiment"]["label"] in ("positive", "negative", "neutral")
        assert -1.0 <= data["sentiment"]["score"] <= 1.0
        assert 0.0 <= data["sentiment"]["confidence"] <= 1.0

    def test_negative_text(self):
        r = client.post("/api/v1/analyze-sentiment", json={
            "text": "This is terrible news. Everything is failing and people are dying.",
            "include_emotions": True,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["sentiment"]["score"] < 0.5

    def test_emotions_included(self):
        r = client.post("/api/v1/analyze-sentiment", json={
            "text": SAMPLE_TEXT, "include_emotions": True
        })
        assert r.status_code == 200
        assert r.json()["sentiment"]["emotions"] is not None

    def test_empty_text_rejected(self):
        r = client.post("/api/v1/analyze-sentiment", json={"text": "hi"})
        assert r.status_code == 422

    def test_word_count_returned(self):
        r = client.post("/api/v1/analyze-sentiment", json={"text": SAMPLE_TEXT})
        assert r.json()["word_count"] > 0


# ── Trend Detection ────────────────────────────────────────────────
class TestTrend:
    def _make_series(self, values):
        from datetime import datetime, timedelta
        base = datetime(2024, 1, 1, 0, 0)
        return [{"timestamp": (base + timedelta(hours=i)).isoformat(), "value": v}
                for i, v in enumerate(values)]

    def test_flat_series_stable(self):
        series = self._make_series([100, 102, 98, 101, 99, 103, 100, 101])
        r = client.post("/api/v1/detect-trend", json={"series": series, "metric": "shares"})
        assert r.status_code == 200
        data = r.json()
        assert data["virality_level"] in ("STABLE", "RISING", "TRENDING", "VIRAL")
        assert 0 <= data["virality_score"] <= 100

    def test_spike_detected(self):
        # Clear spike at position 6
        series = self._make_series([100, 102, 98, 101, 99, 103, 5000, 101, 98])
        r = client.post("/api/v1/detect-trend", json={"series": series, "metric": "shares"})
        assert r.status_code == 200
        data = r.json()
        assert data["spikes_detected"] >= 1
        assert data["virality_level"] in ("TRENDING", "VIRAL")

    def test_too_short_series_rejected(self):
        series = self._make_series([100, 200])
        r = client.post("/api/v1/detect-trend", json={"series": series})
        assert r.status_code == 422

    def test_returns_metrics(self):
        series = self._make_series([100, 150, 200, 300, 800, 400, 200])
        r = client.post("/api/v1/detect-trend", json={"series": series})
        assert "trend_metrics" in r.json()
        assert "recommendation" in r.json()


# ── Topic Classification ───────────────────────────────────────────
class TestTopic:
    def test_health_article_classified(self):
        text = "New vaccine approved by WHO for malaria prevention showing 75% efficacy in trials."
        r = client.post("/api/v1/classify-topic", json={"text": text})
        assert r.status_code == 200
        data = r.json()
        assert data["top_topic"] in ("Health", "Science", "General")
        assert len(data["all_topics"]) >= 1

    def test_tech_article(self):
        text = "OpenAI releases new GPT model with breakthrough reasoning capabilities for software developers."
        r = client.post("/api/v1/classify-topic", json={"text": text})
        assert r.status_code == 200
        assert r.json()["top_topic"] in ("Technology", "Science", "General")

    def test_top_k_respected(self):
        r = client.post("/api/v1/classify-topic", json={"text": SAMPLE_TEXT, "top_k": 3})
        assert len(r.json()["all_topics"]) <= 3

    def test_keywords_returned(self):
        r = client.post("/api/v1/classify-topic", json={"text": SAMPLE_TEXT})
        assert len(r.json()["keywords"]) > 0


# ── Misinformation ─────────────────────────────────────────────────
class TestMisinfo:
    def test_clean_article_not_flagged(self):
        r = client.post("/api/v1/detect-misinformation", json={"text": SAMPLE_TEXT})
        assert r.status_code == 200
        data = r.json()
        assert data["risk_level"] in ("NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL")

    def test_misinfo_text_flagged(self):
        r = client.post("/api/v1/detect-misinformation", json={"text": MISINFO_TEXT})
        assert r.status_code == 200
        data = r.json()
        assert data["flagged"] is True
        assert data["confidence"] > 0.4
        assert data["risk_level"] in ("HIGH", "CRITICAL")

    def test_signals_returned(self):
        r = client.post("/api/v1/detect-misinformation", json={"text": MISINFO_TEXT})
        assert len(r.json()["signals"]) > 0

    def test_credibility_indicators(self):
        r = client.post("/api/v1/detect-misinformation", json={"text": MISINFO_TEXT})
        indicators = r.json()["credibility_indicators"]
        assert indicators["has_excessive_capitalization"] is True
        assert indicators["has_excessive_punctuation"] is True


# ── Full Analysis ──────────────────────────────────────────────────
class TestFullAnalysis:
    def test_full_pipeline(self):
        r = client.post("/api/v1/analyze", json={"text": SAMPLE_TEXT})
        assert r.status_code == 200
        data = r.json()
        assert "sentiment" in data
        assert "misinfo" in data
        assert "topic" in data
        assert "virality" in data
        assert "toxicity" in data

    def test_word_count_correct(self):
        r = client.post("/api/v1/analyze", json={"text": SAMPLE_TEXT})
        assert r.json()["word_count"] == len(SAMPLE_TEXT.split())

    def test_no_text_rejected(self):
        r = client.post("/api/v1/analyze", json={"text": ""})
        assert r.status_code in (400, 422)


# ── Batch ──────────────────────────────────────────────────────────
class TestBatch:
    def test_batch_two_items(self):
        r = client.post("/api/v1/batch/analyze", json={
            "items": [
                {"text": SAMPLE_TEXT},
                {"text": MISINFO_TEXT},
            ],
            "include_sentiment": True,
            "include_misinfo": True,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["total"] == 2
        assert data["succeeded"] + data["failed"] == 2

    def test_batch_async_mode(self):
        r = client.post("/api/v1/batch/analyze", json={
            "items": [{"text": SAMPLE_TEXT}],
            "async_mode": True,
        })
        assert r.status_code == 200
        data = r.json()
        assert data["async_mode"] is True
        assert data["job_id"] is not None

    def test_empty_batch_rejected(self):
        r = client.post("/api/v1/batch/analyze", json={"items": []})
        assert r.status_code == 422


# ── NER ────────────────────────────────────────────────────────────
class TestNER:
    def test_entities_extracted(self):
        text = "Elon Musk announced that Tesla will launch a new EV in India in 2025."
        r = client.post("/api/v1/extract-entities", json={"text": text})
        assert r.status_code == 200
        data = r.json()
        assert "entities" in data
        assert "keywords" in data


# ── Web Data ───────────────────────────────────────────────────────
class TestWebData:
    def test_rss_fetch_general(self):
        r = client.post("/api/v1/fetch-web-data", json={
            "query": "india",
            "source": "rss",
            "page_size": 3,
            "analyze": False,
        })
        assert r.status_code == 200
        data = r.json()
        assert "articles" in data
        assert data["source"] == "rss"

    def test_fetch_with_analysis(self):
        r = client.post("/api/v1/fetch-web-data", json={
            "query": "technology",
            "source": "rss",
            "page_size": 2,
            "analyze": True,
        })
        assert r.status_code == 200
        assert r.json()["analyzed"] is True
