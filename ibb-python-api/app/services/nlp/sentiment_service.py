"""
Sentiment Analysis Service
- Primary: HuggingFace transformers (DistilBERT/RoBERTa)
- Fallback: NLTK VADER (always available, no downloads needed)
- Tertiary: Pure lexicon rule-based
"""

import re
import time
import math
from typing import Dict, List, Optional, Tuple
from loguru import logger
from app.services.nlp.model_manager import model_manager
from app.schemas.responses import SentimentResult, EmotionBreakdown
from app.core.config import settings


# ── Emotion lexicons ───────────────────────────────────────────────
EMOTION_LEXICONS = {
    "joy":          ["happy", "joy", "love", "great", "wonderful", "amazing", "celebrate", "excited", "delight", "fantastic", "brilliant", "win", "success", "cheerful", "elated"],
    "anger":        ["angry", "furious", "rage", "hate", "outrage", "disgusting", "horrible", "attack", "corrupt", "disgrace", "infuriating", "ridiculous", "appalling", "disgust"],
    "fear":         ["fear", "afraid", "terror", "scared", "danger", "threat", "risk", "alarm", "panic", "dread", "anxiety", "nervous", "worried", "horrified", "frightening"],
    "sadness":      ["sad", "tragedy", "mourn", "death", "grief", "loss", "sorrow", "heartbreak", "devastated", "cry", "miserable", "depressed", "hopeless", "unfortunate"],
    "surprise":     ["shocking", "unexpected", "astonishing", "incredible", "unbelievable", "revelation", "breaking", "jaw-dropping", "stunning", "bombshell", "unprecedented"],
    "disgust":      ["disgusting", "filthy", "awful", "revolting", "vile", "sick", "nasty", "offensive", "repulsive", "nauseating", "abhorrent", "shameful", "despicable"],
    "trust":        ["reliable", "credible", "confirmed", "official", "verified", "trustworthy", "transparent", "accountable", "honest", "legitimate", "authentic", "proven"],
    "anticipation": ["expect", "hope", "predict", "soon", "upcoming", "future", "plan", "prepare", "await", "imminent", "forecast", "project", "anticipate", "next"],
}

# Negation words that flip sentiment
NEGATIONS = {"not", "no", "never", "neither", "nor", "none", "nobody", "nothing", "nowhere", "cannot", "can't", "won't", "isn't", "aren't", "wasn't", "weren't", "don't", "doesn't", "didn't", "hardly", "scarcely", "barely"}


class SentimentService:

    def __init__(self):
        self._vader = None
        self._vader_loaded = False

    def _get_vader(self):
        """Lazily load VADER analyser."""
        if not self._vader_loaded:
            try:
                from nltk.sentiment.vader import SentimentIntensityAnalyzer
                import nltk
                try:
                    self._vader = SentimentIntensityAnalyzer()
                except LookupError:
                    nltk.download("vader_lexicon", quiet=True)
                    self._vader = SentimentIntensityAnalyzer()
                self._vader_loaded = True
                logger.debug("VADER analyser loaded")
            except Exception as e:
                logger.warning(f"VADER not available: {e}")
        return self._vader

    # ── Primary: Transformers ─────────────────────────────────────
    def _analyze_transformer(self, text: str) -> Optional[Dict]:
        pipeline = model_manager.sentiment_pipeline
        if not pipeline:
            return None
        try:
            truncated = text[:settings.max_text_length * 4]  # rough char limit
            results = pipeline(truncated)

            # Handle different model output formats
            if isinstance(results[0], list):
                scores = results[0]
            else:
                scores = results

            label_map = {}
            for item in scores:
                lbl = item["label"].lower()
                if lbl in ("label_0", "negative", "neg"):
                    label_map["negative"] = item["score"]
                elif lbl in ("label_1", "neutral"):
                    label_map["neutral"] = item["score"]
                elif lbl in ("label_2", "positive", "pos"):
                    label_map["positive"] = item["score"]

            # 2-class model (no neutral)
            if "neutral" not in label_map:
                pos = label_map.get("positive", 0.5)
                neg = label_map.get("negative", 0.5)
                label_map["neutral"] = max(0.0, 1.0 - pos - neg)

            pos = label_map.get("positive", 0.33)
            neg = label_map.get("negative", 0.33)
            neu = label_map.get("neutral", 0.34)

            # Normalise
            total = pos + neg + neu or 1
            pos, neg, neu = pos / total, neg / total, neu / total

            score = pos - neg  # range -1 to +1
            label = "positive" if pos > neg and pos > neu else "negative" if neg > pos and neg > neu else "neutral"
            confidence = max(pos, neg, neu)

            return {
                "score": round(score, 4),
                "label": label,
                "confidence": round(confidence, 4),
                "positive_prob": round(pos, 4),
                "negative_prob": round(neg, 4),
                "neutral_prob": round(neu, 4),
            }
        except Exception as e:
            logger.warning(f"Transformer sentiment failed: {e}")
            return None

    # ── Secondary: VADER ─────────────────────────────────────────
    def _analyze_vader(self, text: str) -> Dict:
        vader = self._get_vader()
        if not vader:
            return self._analyze_lexicon(text)
        try:
            scores = vader.polarity_scores(text)
            compound = scores["compound"]
            pos = scores["pos"]
            neg = scores["neg"]
            neu = scores["neu"]

            if compound >= 0.05:
                label, confidence = "positive", min(0.99, 0.5 + compound / 2)
            elif compound <= -0.05:
                label, confidence = "negative", min(0.99, 0.5 + abs(compound) / 2)
            else:
                label, confidence = "neutral", max(0.5, neu)

            return {
                "score": round(compound, 4),
                "label": label,
                "confidence": round(confidence, 4),
                "positive_prob": round(pos, 4),
                "negative_prob": round(neg, 4),
                "neutral_prob": round(neu, 4),
            }
        except Exception as e:
            logger.warning(f"VADER failed: {e}")
            return self._analyze_lexicon(text)

    # ── Tertiary: Pure lexicon ─────────────────────────────────────
    def _analyze_lexicon(self, text: str) -> Dict:
        POSITIVE = {"good","great","excellent","amazing","wonderful","fantastic","love","best","happy","joy","win","success","positive","hope","safe","peace","beautiful","outstanding"}
        NEGATIVE = {"bad","terrible","awful","horrible","hate","worst","sad","tragic","dangerous","corrupt","crisis","disaster","failed","wrong","fear","anger","disgust","threat","kill","attack"}

        words = re.findall(r"\b\w+\b", text.lower())
        pos_count = sum(1 for w in words if w in POSITIVE)
        neg_count = sum(1 for w in words if w in NEGATIVE)
        total = max(1, pos_count + neg_count)

        score = (pos_count - neg_count) / max(1, len(words)) * 5
        score = max(-1.0, min(1.0, score))
        label = "positive" if score > 0.05 else "negative" if score < -0.05 else "neutral"
        confidence = min(0.85, 0.5 + abs(score) * 0.5)

        return {
            "score": round(score, 4),
            "label": label,
            "confidence": round(confidence, 4),
            "positive_prob": round(pos_count / total, 4) if total > 0 else 0.33,
            "negative_prob": round(neg_count / total, 4) if total > 0 else 0.33,
            "neutral_prob": round(1 - pos_count / total - neg_count / total, 4) if total > 0 else 0.34,
        }

    # ── Emotion breakdown ─────────────────────────────────────────
    def _compute_emotions(self, text: str) -> EmotionBreakdown:
        text_lower = text.lower()
        words = set(re.findall(r"\b\w+\b", text_lower))
        scores = {}
        for emotion, lexicon in EMOTION_LEXICONS.items():
            hits = sum(1 for w in lexicon if w in words)
            scores[emotion] = round(min(100.0, hits * 15.0), 2)

        return EmotionBreakdown(**scores)

    # ── Subjectivity ──────────────────────────────────────────────
    def _compute_subjectivity(self, text: str) -> float:
        SUBJECTIVE = {"i","me","my","we","our","think","believe","feel","opinion","personally","seems","appears","probably","maybe","perhaps","claim","suggest","argue","suppose"}
        words = re.findall(r"\b\w+\b", text.lower())
        subj_count = sum(1 for w in words if w in SUBJECTIVE)
        return round(min(1.0, subj_count / max(1, len(words)) * 10), 4)

    # ── Main analysis ─────────────────────────────────────────────
    async def analyze(
        self,
        text: str,
        include_emotions: bool = True,
        language: str = "en",
    ) -> SentimentResult:
        start = time.time()

        # Try cascade: transformers → VADER → lexicon
        result = self._analyze_transformer(text)
        if result is None:
            logger.debug("Using VADER fallback")
            result = self._analyze_vader(text)

        emotions = self._compute_emotions(text) if include_emotions else None
        subjectivity = self._compute_subjectivity(text)

        elapsed = round((time.time() - start) * 1000, 1)
        logger.debug(f"Sentiment analyzed in {elapsed}ms | label={result['label']} | score={result['score']}")

        return SentimentResult(
            **result,
            emotions=emotions,
            subjectivity=subjectivity,
        )

    async def analyze_batch(
        self,
        texts: List[str],
        include_emotions: bool = False,
    ) -> List[SentimentResult]:
        """Batch-optimised sentiment analysis using pipeline batching."""
        pipeline = model_manager.sentiment_pipeline
        results = []

        if pipeline:
            try:
                truncated = [t[:settings.max_text_length * 4] for t in texts]
                raw_results = pipeline(truncated, batch_size=settings.batch_size)
                for text, raw in zip(texts, raw_results):
                    # Reuse single-item result extraction
                    if isinstance(raw, list):
                        scores = {r["label"].lower(): r["score"] for r in raw}
                    else:
                        scores = {raw["label"].lower(): raw["score"]}

                    pos = scores.get("positive", scores.get("label_2", 0.33))
                    neg = scores.get("negative", scores.get("label_0", 0.33))
                    neu = scores.get("neutral", scores.get("label_1", 1 - pos - neg))
                    total = pos + neg + neu or 1
                    pos, neg, neu = pos / total, neg / total, neu / total
                    score = pos - neg
                    label = "positive" if pos > neg and pos > neu else "negative" if neg > pos and neg > neu else "neutral"

                    results.append(SentimentResult(
                        score=round(score, 4),
                        label=label,
                        confidence=round(max(pos, neg, neu), 4),
                        positive_prob=round(pos, 4),
                        negative_prob=round(neg, 4),
                        neutral_prob=round(neu, 4),
                        emotions=self._compute_emotions(text) if include_emotions else None,
                        subjectivity=self._compute_subjectivity(text),
                    ))
                return results
            except Exception as e:
                logger.warning(f"Batch transformer failed: {e} — falling back to VADER")

        # VADER fallback — sequential
        for text in texts:
            res = self._analyze_vader(text)
            results.append(SentimentResult(
                **res,
                emotions=self._compute_emotions(text) if include_emotions else None,
                subjectivity=self._compute_subjectivity(text),
            ))
        return results


sentiment_service = SentimentService()
