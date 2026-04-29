# 🖤 Internet Black Box — Python AI/NLP Service v2.0

> **FastAPI + HuggingFace Transformers + spaCy + NLTK**  
> Production-ready NLP microservice for the IBB research platform.

---

## 📁 Folder Structure

```
ibb-python-api/
├── main.py                          ← Entry point (uvicorn)
├── gunicorn.conf.py                 ← Production Gunicorn config
├── requirements.txt
├── Dockerfile
├── .env.example
│
├── app/
│   ├── main.py                      ← FastAPI app factory + lifespan
│   │
│   ├── core/
│   │   ├── config.py                ← Pydantic-settings env config
│   │   ├── logging.py               ← Loguru structured logging
│   │   ├── cache.py                 ← Redis async cache + @cached decorator
│   │   └── security.py              ← API key auth + SlowAPI rate limiter
│   │
│   ├── api/v1/
│   │   ├── router.py                ← Master API router
│   │   └── endpoints/
│   │       ├── sentiment.py         ← POST /analyze-sentiment
│   │       ├── trend.py             ← POST /detect-trend
│   │       ├── topic.py             ← POST /classify-topic
│   │       ├── misinfo.py           ← POST /detect-misinformation
│   │       ├── scraper.py           ← POST /fetch-web-data
│   │       └── extras.py            ← POST /analyze, /batch/analyze,
│   │                                   /extract-entities, /health
│   │
│   ├── services/
│   │   ├── nlp/
│   │   │   ├── model_manager.py     ← Singleton lazy model loader
│   │   │   ├── sentiment_service.py ← Transformers → VADER → Lexicon cascade
│   │   │   └── ner_service.py       ← spaCy → Regex NER + keywords
│   │   ├── trend/
│   │   │   └── trend_service.py     ← Z-score spike detection + metrics
│   │   ├── misinfo/
│   │   │   └── misinfo_service.py   ← 3-layer misinfo detection
│   │   ├── topic/
│   │   │   └── topic_service.py     ← Zero-shot + TF-IDF classifier
│   │   ├── scraper/
│   │   │   └── scraper_service.py   ← NewsAPI, GNews, RSS, BeautifulSoup
│   │   └── batch/
│   │       └── batch_service.py     ← Async batch + job store
│   │
│   ├── schemas/
│   │   ├── requests.py              ← All Pydantic request models
│   │   └── responses.py             ← All Pydantic response models
│   │
│   ├── middleware/
│   │   └── logging_middleware.py    ← Request ID + timing middleware
│   │
│   └── utils/
│       └── text_utils.py            ← Readability, toxicity, summarize, etc.
│
├── tests/
│   └── test_api.py                  ← Full pytest test suite (40+ tests)
│
└── scripts/
    └── download_models.py           ← One-time model download helper
```

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — at minimum set ENVIRONMENT=development
```

### 3. Download NLP models (first time only)
```bash
python scripts/download_models.py
```
> Without this step, the API still works — it falls back to rule-based engines automatically.

### 4. Run development server
```bash
python main.py
# OR
uvicorn app.main:app --reload --port 8000
```

### 5. Production (Gunicorn + Uvicorn workers)
```bash
gunicorn -c gunicorn.conf.py app.main:app
```

### 6. Docker
```bash
docker build -t ibb-ai-service .
docker run -p 8000:8000 --env-file .env ibb-ai-service
```

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:8000/api/v1`  
**Interactive docs:** `http://localhost:8000/docs`

### Core NLP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze-sentiment` | Sentiment + emotions + subjectivity |
| POST | `/detect-trend` | Viral spike detection from time-series |
| POST | `/classify-topic` | Topic classification (10 categories) |
| POST | `/detect-misinformation` | Multi-layer misinfo detection |
| POST | `/fetch-web-data` | News/web fetch + auto-analysis |

### Advanced Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Full pipeline (all above combined) |
| POST | `/batch/analyze` | Batch 1–500 texts |
| GET | `/batch/job/{id}` | Async batch job status |
| POST | `/extract-entities` | NER + keyword extraction |
| GET | `/health` | System + model health |
| GET | `/models` | Loaded model info |
| GET | `/metrics` | Prometheus metrics |

---

## 📨 Request / Response Examples

### Sentiment Analysis
```bash
curl -X POST http://localhost:8000/api/v1/analyze-sentiment \
  -H "Content-Type: application/json" \
  -d '{"text": "India GDP growth surpasses expectations at 8.4%", "include_emotions": true}'
```
```json
{
  "success": true,
  "text_preview": "India GDP growth...",
  "word_count": 9,
  "sentiment": {
    "score": 0.72,
    "label": "positive",
    "confidence": 0.91,
    "positive_prob": 0.85,
    "negative_prob": 0.06,
    "neutral_prob": 0.09,
    "emotions": { "joy": 35.0, "trust": 28.0, "anticipation": 18.0, ... },
    "subjectivity": 0.12
  }
}
```

### Viral Trend Detection
```bash
curl -X POST http://localhost:8000/api/v1/detect-trend \
  -H "Content-Type: application/json" \
  -d '{
    "series": [
      {"timestamp": "2024-01-01T00:00:00", "value": 1200},
      {"timestamp": "2024-01-01T01:00:00", "value": 1350},
      {"timestamp": "2024-01-01T02:00:00", "value": 1280},
      {"timestamp": "2024-01-01T03:00:00", "value": 94000},
      {"timestamp": "2024-01-01T04:00:00", "value": 45000},
      {"timestamp": "2024-01-01T05:00:00", "value": 12000}
    ],
    "metric": "shares",
    "topic": "AI Regulation Bill"
  }'
```
```json
{
  "virality_level": "VIRAL",
  "virality_score": 87,
  "spikes_detected": 1,
  "spikes": [
    {
      "timestamp": "2024-01-01T03:00:00",
      "value": 94000,
      "zscore": 5.4,
      "baseline": 1276.7,
      "spike_ratio": 73.6,
      "severity": "CRITICAL"
    }
  ],
  "trend_metrics": { "trend_direction": "FALLING", "mean": 25805, ... },
  "recommendation": "🚨 VIRAL ALERT — 1 critical spike detected..."
}
```

### Misinformation Detection
```bash
curl -X POST http://localhost:8000/api/v1/detect-misinformation \
  -H "Content-Type: application/json" \
  -d '{"text": "VACCINES contain MICROCHIPS activated by 5G towers!! Share before deleted!!!"}'
```
```json
{
  "flagged": true,
  "confidence": 0.89,
  "risk_level": "CRITICAL",
  "misinfo_type": "health_misinfo",
  "signals": [
    { "signal_type": "keyword_match_health_misinfo", "severity": "HIGH", "score": 0.85 },
    { "signal_type": "excessive_capitalization", "severity": "MEDIUM", "score": 0.38 },
    { "signal_type": "emotional_manipulation", "severity": "HIGH", "score": 0.4 }
  ],
  "recommendation": "🚨 DO NOT SHARE — High-confidence misinformation."
}
```

### Batch Processing
```bash
curl -X POST http://localhost:8000/api/v1/batch/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"id": "a1", "text": "Scientists discover cancer breakthrough"},
      {"id": "a2", "text": "SHOCKING: Government hiding cure for cancer!!!"}
    ],
    "include_sentiment": true,
    "include_misinfo": true,
    "include_topics": true
  }'
```

---

## 🧠 Model Architecture

| Task | Primary Model | Fallback | Speed |
|------|--------------|----------|-------|
| Sentiment | DistilBERT-SST-2 | NLTK VADER | ~80ms |
| Topic Classification | BART-large-mnli (zero-shot) | TF-IDF keywords | ~300ms |
| NER | spaCy en_core_web_sm | Regex patterns | ~50ms |
| Misinfo Detection | Rule-based (multi-layer) | Rule-based | ~10ms |
| Trend Detection | Z-score + stats | — | ~5ms |
| Toxicity | Heuristic | — | ~2ms |

All models are **lazily loaded** on first use and **cached** in memory for subsequent calls.

### Upgrade to Production Models (optional)

```python
# In .env — swap models for higher accuracy:
SENTIMENT_MODEL=cardiffnlp/twitter-roberta-base-sentiment-latest  # Twitter-trained
TOPIC_MODEL=facebook/bart-large-mnli                               # Default (good)
NER_MODEL=en_core_web_lg                                           # Larger spaCy
```

---

## ⚙️ Node.js Integration

Call from your Node.js backend:

```typescript
// In ai/index.ts
const response = await axios.post(`${AI_SERVICE_URL}/api/v1/analyze`, {
  text: content,
  include_sentiment: true,
  include_misinfo: true,
  include_topics: true,
  include_ner: true,
}, {
  headers: { 'X-API-Key': 'ibb_ai_internal_key' },
  timeout: 15000,
})
const analysis = response.data
```

---

## 🔒 Security

- `X-API-Key` header authentication on all endpoints
- Rate limiting: 60 req/min (sentiment/topic), 30/min (trend/full), 10/min (batch), 20/min (web fetch)
- CORS restricted to configured origins
- GZip compression on responses > 1KB
- No model weights or keys in image

---

## 🧪 Running Tests

```bash
# Install test deps (included in requirements.txt)
pytest tests/ -v --tb=short

# With coverage
pytest tests/ --cov=app --cov-report=term-missing
```

---

## 📈 Scalability

- **Gunicorn** with 2–4 `UvicornWorker` processes (CPU-bound ML limit)
- **Redis** caches: sentiment (5 min), topic (10 min), misinfo (10 min)
- **Async** batch with semaphore (max 8 concurrent AI calls)
- **Lazy model loading** — only loads what's needed
- **Fallback chain** — never crashes, always returns a result
- GPU support via `USE_GPU=true` + CUDA PyTorch

---

*IBB Python AI Service — TMV University BCA Final Year Project 2025–26*
