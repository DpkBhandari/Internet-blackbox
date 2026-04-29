#!/usr/bin/env python3
"""
Download all required NLP models before first run.
Run: python scripts/download_models.py
"""

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.config import settings

print("=" * 60)
print("  IBB AI Service — Model Downloader")
print(f"  Cache dir: {settings.model_cache_dir}")
print(f"  Device: {settings.torch_device}")
print("=" * 60)

os.makedirs(settings.model_cache_dir, exist_ok=True)

# ── 1. NLTK data ───────────────────────────────────────────────────
print("\n[1/4] Downloading NLTK datasets...")
try:
    import nltk
    resources = ["vader_lexicon", "stopwords", "punkt", "averaged_perceptron_tagger"]
    for r in resources:
        nltk.download(r, quiet=False)
        print(f"  ✓ {r}")
except Exception as e:
    print(f"  ✗ NLTK error: {e}")

# ── 2. spaCy model ─────────────────────────────────────────────────
print(f"\n[2/4] Downloading spaCy model: {settings.ner_model}...")
try:
    import subprocess
    result = subprocess.run(
        [sys.executable, "-m", "spacy", "download", settings.ner_model],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        print(f"  ✓ {settings.ner_model}")
    else:
        print(f"  ✗ {result.stderr}")
except Exception as e:
    print(f"  ✗ spaCy error: {e}")

# ── 3. Sentiment model ─────────────────────────────────────────────
print(f"\n[3/4] Downloading sentiment model: {settings.sentiment_model}...")
try:
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    AutoTokenizer.from_pretrained(settings.sentiment_model, cache_dir=settings.model_cache_dir)
    AutoModelForSequenceClassification.from_pretrained(settings.sentiment_model, cache_dir=settings.model_cache_dir)
    print(f"  ✓ {settings.sentiment_model}")
except Exception as e:
    print(f"  ✗ Sentiment model error: {e}")

# ── 4. Zero-shot / topic model ─────────────────────────────────────
print(f"\n[4/4] Downloading topic model: {settings.topic_model}...")
try:
    from transformers import pipeline
    pipe = pipeline("zero-shot-classification", model=settings.topic_model, cache_dir=settings.model_cache_dir)
    print(f"  ✓ {settings.topic_model}")
except Exception as e:
    print(f"  ✗ Topic model error: {e}")
    print("  → Topic classification will use keyword fallback")

print("\n" + "=" * 60)
print("  Download complete! Run: python main.py")
print("=" * 60)
