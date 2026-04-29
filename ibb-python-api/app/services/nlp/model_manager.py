"""
ModelManager — Singleton that lazily loads and caches all NLP models.
Prevents repeated loading across requests and workers.
"""

import time
import asyncio
from typing import Optional, Dict, Any
from loguru import logger
from app.core.config import settings


class ModelManager:
    """
    Thread-safe singleton for managing all NLP model instances.
    Models are loaded lazily on first use and cached for subsequent calls.
    """

    _instance: Optional["ModelManager"] = None
    _lock = asyncio.Lock()

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True

        # Model holders
        self._sentiment_pipeline = None
        self._sentiment_tokenizer = None
        self._zero_shot_pipeline = None
        self._ner_pipeline = None
        self._spacy_nlp = None

        # Load status tracking
        self._load_status: Dict[str, bool] = {
            "sentiment": False,
            "zero_shot": False,
            "ner": False,
            "spacy": False,
        }
        self._load_times: Dict[str, float] = {}

        logger.info(
            f"ModelManager initialized | device={settings.torch_device} | "
            f"cache_dir={settings.model_cache_dir}"
        )

    # ── Sentiment Pipeline ────────────────────────────────────────
    @property
    def sentiment_pipeline(self):
        if self._sentiment_pipeline is None:
            self._load_sentiment()
        return self._sentiment_pipeline

    def _load_sentiment(self):
        start = time.time()
        try:
            from transformers import pipeline
            import os
            os.makedirs(settings.model_cache_dir, exist_ok=True)

            logger.info(f"Loading sentiment model: {settings.sentiment_model}")
            self._sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model=settings.sentiment_model,
                device=0 if settings.torch_device == "cuda" else -1,
                cache_dir=settings.model_cache_dir,
                truncation=True,
                max_length=settings.max_text_length,
                batch_size=settings.batch_size,
                return_all_scores=True,
            )
            elapsed = round((time.time() - start) * 1000, 1)
            self._load_status["sentiment"] = True
            self._load_times["sentiment"] = elapsed
            logger.success(f"Sentiment model loaded in {elapsed}ms")
        except Exception as e:
            logger.error(f"Failed to load sentiment model: {e}")
            logger.warning("Falling back to rule-based sentiment analysis")
            self._sentiment_pipeline = None

    # ── Zero-Shot Classification (for topics) ─────────────────────
    @property
    def zero_shot_pipeline(self):
        if self._zero_shot_pipeline is None:
            self._load_zero_shot()
        return self._zero_shot_pipeline

    def _load_zero_shot(self):
        start = time.time()
        try:
            from transformers import pipeline

            logger.info(f"Loading zero-shot model: {settings.topic_model}")
            self._zero_shot_pipeline = pipeline(
                "zero-shot-classification",
                model=settings.topic_model,
                device=0 if settings.torch_device == "cuda" else -1,
                cache_dir=settings.model_cache_dir,
            )
            elapsed = round((time.time() - start) * 1000, 1)
            self._load_status["zero_shot"] = True
            self._load_times["zero_shot"] = elapsed
            logger.success(f"Zero-shot model loaded in {elapsed}ms")
        except Exception as e:
            logger.warning(f"Zero-shot model failed to load: {e} — using keyword classifier")
            self._zero_shot_pipeline = None

    # ── spaCy NLP ─────────────────────────────────────────────────
    @property
    def spacy_nlp(self):
        if self._spacy_nlp is None:
            self._load_spacy()
        return self._spacy_nlp

    def _load_spacy(self):
        start = time.time()
        try:
            import spacy
            logger.info(f"Loading spaCy model: {settings.ner_model}")
            try:
                self._spacy_nlp = spacy.load(settings.ner_model)
            except OSError:
                logger.warning(f"spaCy model '{settings.ner_model}' not found — downloading...")
                import subprocess
                subprocess.run(
                    ["python", "-m", "spacy", "download", settings.ner_model],
                    check=True, capture_output=True,
                )
                self._spacy_nlp = spacy.load(settings.ner_model)

            elapsed = round((time.time() - start) * 1000, 1)
            self._load_status["spacy"] = True
            self._load_times["spacy"] = elapsed
            logger.success(f"spaCy model loaded in {elapsed}ms")
        except Exception as e:
            logger.warning(f"spaCy failed: {e} — NER will use basic regex extraction")
            self._spacy_nlp = None

    # ── NLTK data ─────────────────────────────────────────────────
    @staticmethod
    def ensure_nltk_data():
        try:
            import nltk
            required = ["vader_lexicon", "stopwords", "punkt", "averaged_perceptron_tagger"]
            for resource in required:
                try:
                    nltk.data.find(f"tokenizers/{resource}" if resource == "punkt"
                                   else f"sentiment/{resource}" if resource == "vader_lexicon"
                                   else f"corpora/{resource}")
                except LookupError:
                    logger.info(f"Downloading NLTK resource: {resource}")
                    nltk.download(resource, quiet=True)
        except Exception as e:
            logger.warning(f"NLTK setup error: {e}")

    # ── Status ────────────────────────────────────────────────────
    def get_status(self) -> Dict[str, Any]:
        return {
            "models": {
                name: {
                    "loaded": loaded,
                    "load_time_ms": self._load_times.get(name),
                }
                for name, loaded in self._load_status.items()
            },
            "device": settings.torch_device,
            "cache_dir": settings.model_cache_dir,
        }

    def preload_all(self):
        """Eagerly load all models at startup (optional)."""
        logger.info("Preloading all NLP models...")
        self.ensure_nltk_data()
        _ = self.sentiment_pipeline
        _ = self.spacy_nlp
        logger.info("Model preload complete")


# ── Singleton instance ─────────────────────────────────────────────
model_manager = ModelManager()
