"""
Topic Classification Service
- Primary: Zero-shot classification (BART-large-mnli)
- Fallback: TF-IDF keyword matching per category
- Returns ranked topic list with confidence scores
"""

import re
import time
import math
from typing import List, Dict, Optional, Tuple
from loguru import logger
from app.services.nlp.model_manager import model_manager
from app.schemas.responses import TopicResponse, TopicScore

# ── Category keyword profiles ─────────────────────────────────────
CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "Politics": [
        "government", "parliament", "election", "president", "minister", "party",
        "vote", "democracy", "policy", "law", "senate", "congress", "legislation",
        "political", "campaign", "coalition", "opposition", "budget", "referendum",
        "diplomat", "foreign", "bilateral", "sanctions", "treaty", "constitution",
        "lok sabha", "rajya sabha", "bjp", "congress", "modi", "rahul", "cm", "pm",
    ],
    "Health": [
        "health", "medical", "hospital", "doctor", "patient", "disease", "virus",
        "vaccine", "treatment", "drug", "medicine", "surgery", "diagnosis",
        "symptoms", "pandemic", "epidemic", "outbreak", "WHO", "CDC", "clinical",
        "cancer", "diabetes", "heart", "lung", "mental health", "therapy",
        "pharmaceutical", "biotech", "genome", "mutation",
    ],
    "Technology": [
        "technology", "ai", "artificial intelligence", "software", "startup",
        "innovation", "digital", "internet", "computer", "algorithm", "data",
        "cybersecurity", "hack", "coding", "app", "smartphone", "5g", "cloud",
        "machine learning", "blockchain", "crypto", "nft", "metaverse", "robot",
        "silicon valley", "openai", "google", "microsoft", "apple", "amazon",
    ],
    "Economy": [
        "economy", "economic", "gdp", "inflation", "recession", "market", "stock",
        "trade", "export", "import", "investment", "financial", "bank", "rupee",
        "dollar", "currency", "fiscal", "budget", "tax", "revenue", "growth",
        "employment", "unemployment", "poverty", "imf", "world bank", "rbi",
    ],
    "Environment": [
        "climate", "environment", "pollution", "carbon", "emissions", "renewable",
        "solar", "wind", "green", "sustainability", "deforestation", "biodiversity",
        "ocean", "glacier", "temperature", "drought", "flood", "wildfire",
        "plastic", "recycling", "fossil", "energy", "cop28", "paris agreement",
    ],
    "Science": [
        "research", "study", "scientist", "discovery", "experiment", "lab",
        "physics", "chemistry", "biology", "astronomy", "nasa", "isro", "space",
        "satellite", "moon", "mars", "mission", "quantum", "particle", "genome",
        "evolution", "fossil", "archaeological", "university", "journal",
    ],
    "Sports": [
        "cricket", "football", "soccer", "tennis", "basketball", "hockey",
        "olympics", "tournament", "championship", "match", "team", "player",
        "goal", "score", "ipl", "bcci", "fifa", "medal", "athlete", "coach",
        "stadium", "league", "series", "cup", "final", "qualifier",
    ],
    "Entertainment": [
        "movie", "film", "actor", "actress", "bollywood", "hollywood", "music",
        "song", "album", "concert", "celebrity", "award", "oscar", "grammy",
        "television", "show", "series", "netflix", "ott", "trailer", "release",
        "director", "producer", "box office", "streaming", "viral video",
    ],
    "Education": [
        "education", "school", "college", "university", "student", "teacher",
        "exam", "syllabus", "curriculum", "degree", "scholarship", "admission",
        "learning", "academic", "research", "faculty", "campus", "ugc", "cbse",
        "neet", "jee", "upsc", "course", "online learning", "skill",
    ],
    "General": [],
}

# Zero-shot label descriptions (more descriptive = better accuracy)
ZERO_SHOT_LABELS = {
    "Politics": "politics, government, elections, policies, and political parties",
    "Health": "health, medicine, diseases, vaccines, hospitals, and medical research",
    "Technology": "technology, artificial intelligence, software, startups, and innovation",
    "Economy": "economy, financial markets, GDP, inflation, trade, and banking",
    "Environment": "climate change, environment, pollution, renewable energy, and sustainability",
    "Science": "science, research, space exploration, biology, physics, and discoveries",
    "Sports": "sports, cricket, football, athletics, tournaments, and championships",
    "Entertainment": "entertainment, movies, music, celebrities, Bollywood, and pop culture",
    "Education": "education, schools, universities, exams, and academic topics",
    "General": "general news, miscellaneous topics",
}


class TopicClassificationService:

    # ── Keyword TF-IDF fallback ───────────────────────────────────
    def _classify_keywords(
        self, text: str, top_k: int = 3, threshold: float = 0.05
    ) -> List[TopicScore]:
        text_lower = text.lower()
        words = set(re.findall(r"\b\w+\b", text_lower))
        word_count = max(1, len(text_lower.split()))

        scores: Dict[str, float] = {}
        for category, keywords in CATEGORY_KEYWORDS.items():
            if category == "General":
                continue
            hits = sum(1 for kw in keywords if kw in text_lower or kw in words)
            if hits > 0:
                # TF-like score: hits / sqrt(word_count) — normalises for text length
                scores[category] = hits / math.sqrt(word_count)

        if not scores:
            return [TopicScore(category="General", confidence=0.50, rank=1)]

        # Softmax normalisation
        max_score = max(scores.values())
        exp_scores = {k: math.exp(v - max_score) for k, v in scores.items()}
        total = sum(exp_scores.values())
        norm_scores = {k: v / total for k, v in exp_scores.items()}

        # Sort and filter
        ranked = sorted(norm_scores.items(), key=lambda x: x[1], reverse=True)
        results = [
            TopicScore(category=cat, confidence=round(conf, 4), rank=i + 1)
            for i, (cat, conf) in enumerate(ranked[:top_k])
            if conf >= threshold
        ]

        if not results:
            results = [TopicScore(category="General", confidence=0.30, rank=1)]

        return results

    # ── Zero-shot classification ──────────────────────────────────
    def _classify_zero_shot(
        self,
        text: str,
        candidate_labels: Optional[List[str]] = None,
        top_k: int = 3,
        threshold: float = 0.05,
    ) -> Optional[List[TopicScore]]:
        pipeline = model_manager.zero_shot_pipeline
        if not pipeline:
            return None

        try:
            labels = candidate_labels or list(ZERO_SHOT_LABELS.values())
            label_keys = candidate_labels or list(ZERO_SHOT_LABELS.keys())

            # Truncate text for model
            truncated = text[:1500]
            result = pipeline(
                truncated,
                candidate_labels=labels,
                multi_label=True,
            )

            # Map back to category names
            label_map = dict(zip(labels, label_keys))
            scores = []
            for label, score in zip(result["labels"], result["scores"]):
                cat = label_map.get(label, label)
                if score >= threshold:
                    scores.append((cat, score))

            scores.sort(key=lambda x: x[1], reverse=True)
            return [
                TopicScore(category=cat, confidence=round(conf, 4), rank=i + 1)
                for i, (cat, conf) in enumerate(scores[:top_k])
            ]
        except Exception as e:
            logger.warning(f"Zero-shot classification failed: {e}")
            return None

    # ── Keyword extractor ─────────────────────────────────────────
    def _extract_keywords(self, text: str, top_n: int = 10) -> List[str]:
        STOPWORDS = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
            "for", "of", "with", "by", "from", "is", "are", "was", "were",
            "be", "been", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "this", "that",
            "these", "those", "it", "its", "he", "she", "they", "we", "you",
            "i", "me", "my", "our", "their", "which", "who", "what", "when",
            "where", "how", "why", "not", "also", "said", "says", "new",
        }
        words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
        freq: Dict[str, int] = {}
        for w in words:
            if w not in STOPWORDS:
                freq[w] = freq.get(w, 0) + 1

        return sorted(freq, key=freq.get, reverse=True)[:top_n]  # type: ignore

    # ── Main classification ───────────────────────────────────────
    async def classify(
        self,
        text: str,
        top_k: int = 3,
        threshold: float = 0.1,
        custom_categories: Optional[List[str]] = None,
    ) -> TopicResponse:
        start = time.time()

        # Try zero-shot first
        all_topics = self._classify_zero_shot(text, custom_categories, top_k, threshold)

        if all_topics is None:
            logger.debug("Zero-shot unavailable — using keyword classifier")
            all_topics = self._classify_keywords(text, top_k, threshold)

        keywords = self._extract_keywords(text)

        top = all_topics[0] if all_topics else TopicScore(category="General", confidence=0.3, rank=1)

        elapsed = round((time.time() - start) * 1000, 1)
        logger.debug(f"Topic classified: {top.category} ({top.confidence:.3f}) in {elapsed}ms")

        return TopicResponse(
            text_preview=text[:150] + "..." if len(text) > 150 else text,
            top_topic=top.category,
            top_confidence=top.confidence,
            all_topics=all_topics,
            keywords=keywords,
            processing_time_ms=elapsed,
        )


topic_service = TopicClassificationService()
