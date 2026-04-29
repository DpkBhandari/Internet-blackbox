"""
Named Entity Recognition Service
- Primary: spaCy (en_core_web_sm / en_core_web_lg)
- Fallback: Regex-based entity extraction
- Outputs: entities with labels, keyword extraction
"""

import re
import time
from typing import List, Dict, Tuple, Optional
from loguru import logger
from app.services.nlp.model_manager import model_manager
from app.schemas.responses import NERResponse, NamedEntity

# spaCy entity label descriptions
ENTITY_DESCRIPTIONS = {
    "PERSON": "Person or fictional character",
    "ORG": "Company, agency, or institution",
    "GPE": "Country, city, or state",
    "LOC": "Non-GPE location (mountain, river, etc.)",
    "DATE": "Absolute or relative date/period",
    "TIME": "Time smaller than a day",
    "MONEY": "Monetary value with currency",
    "PERCENT": "Percentage including %",
    "NORP": "Nationalities, religious or political groups",
    "EVENT": "Named hurricanes, battles, wars, etc.",
    "FAC": "Building, airport, highway, bridge",
    "PRODUCT": "Objects, vehicles, foods, etc.",
    "WORK_OF_ART": "Titles of books, songs, etc.",
    "LAW": "Named documents made into laws",
    "LANGUAGE": "Any named language",
    "CARDINAL": "Numerals that don't qualify as another type",
    "ORDINAL": "Ordinal numbers (first, second, etc.)",
    "QUANTITY": "Measurements (weight, distance, etc.)",
}

# Regex-based fallback patterns
REGEX_PATTERNS = [
    (r"\b[A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b", "PERSON"),
    (r"\b(?:WHO|UN|NATO|NASA|ISRO|BJP|Congress|IMF|WTO|FBI|CIA|CDC|BCCI|ICC)\b", "ORG"),
    (r"\b(?:India|USA|China|Pakistan|Russia|UK|France|Germany|Japan|Israel|Ukraine|Iran)\b", "GPE"),
    (r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b", "DATE"),
    (r"\b(?:\$|₹|€|£)\s*[\d,]+(?:\.\d+)?(?:\s*(?:billion|million|crore|lakh|thousand))?\b", "MONEY"),
    (r"\b\d+(?:\.\d+)?%\b", "PERCENT"),
    (r"\b\d+(?:\.\d+)?\s*(?:kg|km|miles|feet|metres|meters|tonnes|MW|GW)\b", "QUANTITY"),
]

STOPWORDS = {
    "the","a","an","and","or","but","in","on","at","to","for","of","with",
    "by","from","is","are","was","were","be","been","have","has","had",
    "do","does","did","will","would","could","should","this","that","it",
    "not","also","said","says","new","one","two","three","four","five",
    "per","as","so","if","up","out","about","than","more","over","after",
    "before","between","through","during","into","while","when","where",
    "which","who","what","how","why","even","just","still","yet","both",
}


class NERService:

    # ── spaCy NER ─────────────────────────────────────────────────
    def _extract_spacy(
        self,
        text: str,
        filter_types: Optional[List[str]] = None,
    ) -> List[NamedEntity]:
        nlp = model_manager.spacy_nlp
        if not nlp:
            return self._extract_regex(text, filter_types)

        try:
            doc = nlp(text[:100_000])  # spaCy limit
            entities = []
            seen = set()

            for ent in doc.ents:
                label = ent.label_
                if filter_types and label not in filter_types:
                    continue
                key = (ent.text.strip(), label)
                if key in seen:
                    continue
                seen.add(key)
                entities.append(NamedEntity(
                    text=ent.text.strip(),
                    label=label,
                    start=ent.start_char,
                    end=ent.end_char,
                    description=ENTITY_DESCRIPTIONS.get(label),
                ))

            return entities
        except Exception as e:
            logger.warning(f"spaCy NER failed: {e} — using regex fallback")
            return self._extract_regex(text, filter_types)

    # ── Regex fallback NER ────────────────────────────────────────
    def _extract_regex(
        self,
        text: str,
        filter_types: Optional[List[str]] = None,
    ) -> List[NamedEntity]:
        entities = []
        seen = set()

        for pattern, label in REGEX_PATTERNS:
            if filter_types and label not in filter_types:
                continue
            for match in re.finditer(pattern, text):
                entity_text = match.group().strip()
                if entity_text in seen or len(entity_text) < 2:
                    continue
                seen.add(entity_text)
                entities.append(NamedEntity(
                    text=entity_text,
                    label=label,
                    start=match.start(),
                    end=match.end(),
                    description=ENTITY_DESCRIPTIONS.get(label),
                ))

        return entities

    # ── Keyword extraction ────────────────────────────────────────
    def _extract_keywords(
        self, text: str, top_n: int = 15
    ) -> List[str]:
        """TF-based keyword extraction with stopword removal."""
        words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
        freq: Dict[str, int] = {}
        for w in words:
            if w not in STOPWORDS:
                freq[w] = freq.get(w, 0) + 1

        # Boost multi-word phrases (bigrams)
        bigrams = zip(words, words[1:])
        for w1, w2 in bigrams:
            if w1 not in STOPWORDS and w2 not in STOPWORDS:
                phrase = f"{w1} {w2}"
                freq[phrase] = freq.get(phrase, 0) + 2

        sorted_words = sorted(freq, key=freq.get, reverse=True)  # type: ignore
        return sorted_words[:top_n]

    # ── Entity count summary ──────────────────────────────────────
    def _count_by_label(self, entities: List[NamedEntity]) -> Dict[str, int]:
        counts: Dict[str, int] = {}
        for ent in entities:
            counts[ent.label] = counts.get(ent.label, 0) + 1
        return dict(sorted(counts.items(), key=lambda x: x[1], reverse=True))

    # ── Main entry ────────────────────────────────────────────────
    async def extract(
        self,
        text: str,
        entity_types: Optional[List[str]] = None,
    ) -> NERResponse:
        start = time.time()
        entities = self._extract_spacy(text, entity_types)
        keywords = self._extract_keywords(text)
        entity_counts = self._count_by_label(entities)
        elapsed = round((time.time() - start) * 1000, 1)

        logger.debug(
            f"NER: {len(entities)} entities, {len(keywords)} keywords in {elapsed}ms"
        )

        return NERResponse(
            text_preview=text[:150] + "..." if len(text) > 150 else text,
            entities=entities,
            entity_counts=entity_counts,
            keywords=keywords,
            processing_time_ms=elapsed,
        )


ner_service = NERService()
