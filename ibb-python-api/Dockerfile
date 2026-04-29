# ── Build stage ───────────────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /build

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc g++ curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --user -r requirements.txt

# ── Runtime stage ─────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Runtime libs only
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 curl tini \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy app
COPY . .

# Create directories
RUN mkdir -p logs cache/models data uploads

# Non-root user
RUN groupadd -r ibb && useradd -r -g ibb ibb && \
    chown -R ibb:ibb /app
USER ibb

# Pre-download NLTK data (avoids runtime downloads)
RUN python -c "import nltk; [nltk.download(r, quiet=True) for r in ['vader_lexicon','stopwords','punkt','averaged_perceptron_tagger']]" || true

ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH=/root/.local/bin:$PATH

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health/live || exit 1

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["gunicorn", "-c", "gunicorn.conf.py", "app.main:app"]
