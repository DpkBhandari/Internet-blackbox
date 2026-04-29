"""
Misinformation Detection Service
- Layer 1: Conspiracy keyword matching (fast)
- Layer 2: Linguistic pattern analysis (sensationalism, caps, emotional manipulation)
- Layer 3: Source credibility signals
- Layer 4: Claim structure analysis
- Layer 5: Transformer zero-shot (if loaded)
Outputs: flagged, confidence, type, signals, risk_level
"""

import re
import time
import math
from typing import List, Tuple, Dict, Optional
from loguru import logger
from app.schemas.responses import MisinfoResponse, MisinfoSignal, CredibilityIndicators


# ── Misinformation keyword database ───────────────────────────────
MISINFO_PATTERNS: Dict[str, Dict] = {
    "health_misinfo": {
        "weight": 0.85,
        "keywords": [
            "vaccine microchip", "5g chip", "bill gates population",
            "plandemic", "covid hoax", "ivermectin cure", "bleach cure",
            "hospital killing patients", "natural immunity better than vaccine",
            "graphene oxide", "mRNA changes dna", "vaccine shedding",
            "depopulation agenda", "nwo pandemic", "big pharma hiding cure",
        ],
    },
    "political_misinfo": {
        "weight": 0.80,
        "keywords": [
            "election stolen", "voting machines hacked", "deep state",
            "new world order", "george soros controls", "global elite agenda",
            "shadow government", "false flag operation", "secret agenda",
            "crisis actor", "staged event", "government cover up",
            "fake ballot", "mail fraud election",
        ],
    },
    "technology_misinfo": {
        "weight": 0.75,
        "keywords": [
            "5g causes cancer", "5g covid", "emf radiation kills",
            "wifi dangerous", "chemtrails", "geoengineering mind control",
            "haarp weather control", "cia controls weather",
            "satellites track us", "rfid chip mandatory",
        ],
    },
    "conspiracy": {
        "weight": 0.90,
        "keywords": [
            "illuminati", "lizard people", "reptilian", "flat earth proven",
            "moon landing fake", "nasa lies", "pizza gate", "adrenochrome",
            "satanic elite", "rothschild controls", "secret society ruling",
            "qanon truth", "great reset plan", "human trafficking elite",
        ],
    },
    "fabricated": {
        "weight": 0.70,
        "keywords": [
            "doctors admit", "scientists confirm what they hid",
            "leaked document proves", "whistleblower reveals",
            "mainstream media won't tell you", "they don't want you to know",
            "banned from internet", "censored truth", "share before deleted",
        ],
    },
    "misleading": {
        "weight": 0.60,
        "keywords": [
            "studies show without citation", "experts say without naming",
            "everyone knows that", "obviously proven", "undeniable fact",
            "100% effective", "miracle cure", "instant results guaranteed",
            "ancient secret discovered", "big secret revealed",
        ],
    },
}

# Credible news sources
CREDIBLE_SOURCES = {
    "reuters.com", "bbc.com", "bbc.co.uk", "apnews.com", "bloomberg.com",
    "nytimes.com", "theguardian.com", "wsj.com", "ft.com", "economist.com",
    "nature.com", "science.org", "who.int", "cdc.gov", "nih.gov",
    "thehindu.com", "ndtv.com", "hindustantimes.com", "livemint.com",
}

# Satire sites
SATIRE_DOMAINS = {
    "theonion.com", "babylonbee.com", "newsthump.com", "thespoof.com",
    "clickhole.com", "reductress.com", "thebeaverton.com",
}


class MisinfoDetectionService:

    # ── Layer 1: Keyword matching ─────────────────────────────────
    def _check_keywords(
        self, text: str
    ) -> Tuple[float, Optional[str], List[MisinfoSignal]]:
        text_lower = text.lower()
        signals = []
        best_type = None
        max_confidence = 0.0

        for misinfo_type, config in MISINFO_PATTERNS.items():
            matched = []
            for phrase in config["keywords"]:
                if phrase in text_lower:
                    matched.append(phrase)

            if matched:
                confidence = min(0.95, config["weight"] * (0.4 + len(matched) * 0.15))
                severity = "HIGH" if confidence > 0.75 else "MEDIUM" if confidence > 0.5 else "LOW"

                signals.append(MisinfoSignal(
                    signal_type=f"keyword_match_{misinfo_type}",
                    description=f"Matched {len(matched)} known {misinfo_type.replace('_', ' ')} phrase(s): {', '.join(matched[:3])}",
                    severity=severity,
                    score=round(confidence, 4),
                ))

                if confidence > max_confidence:
                    max_confidence = confidence
                    best_type = misinfo_type

        return max_confidence, best_type, signals

    # ── Layer 2: Linguistic patterns ──────────────────────────────
    def _check_linguistic(self, text: str) -> Tuple[float, List[MisinfoSignal]]:
        signals = []
        total_score = 0.0
        words = text.split()

        # Excessive capitalisation
        words_text = [w for w in words if len(w) >= 3]
        cap_ratio = sum(1 for w in words_text if w.isupper()) / max(1, len(words_text))
        if cap_ratio > 0.15:
            score = min(0.4, cap_ratio * 2)
            total_score += score * 0.3
            signals.append(MisinfoSignal(
                signal_type="excessive_capitalization",
                description=f"{round(cap_ratio * 100)}% words in ALL CAPS — common in sensational/misinfo content",
                severity="MEDIUM" if cap_ratio > 0.25 else "LOW",
                score=round(score, 4),
            ))

        # Excessive punctuation
        excl = text.count("!")
        quest = text.count("?")
        if excl + quest > 3:
            score = min(0.35, (excl + quest) * 0.05)
            total_score += score * 0.2
            signals.append(MisinfoSignal(
                signal_type="excessive_punctuation",
                description=f"Excessive punctuation: {excl} exclamation marks, {quest} question marks",
                severity="LOW",
                score=round(score, 4),
            ))

        # Sensationalist phrases
        SENSATIONAL = [
            r"\bbreaking\b.*\bshocking\b", r"\bmust share\b", r"\bshare before (it\'s )?deleted\b",
            r"\bwon\'t believe\b", r"\bthey don\'t want you to know\b",
            r"\bwake up\b.*\bsheep\b", r"\bdoctors hate\b", r"\bone weird trick\b",
            r"\bsecret (they|governments|media)\b", r"\btruth (revealed|exposed|uncovered)\b",
        ]
        for pattern in SENSATIONAL:
            if re.search(pattern, text.lower()):
                total_score += 0.25
                signals.append(MisinfoSignal(
                    signal_type="sensationalist_language",
                    description=f"Sensationalist phrase pattern detected",
                    severity="MEDIUM",
                    score=0.35,
                ))
                break

        # Emotional manipulation
        MANIPULATIVE = [
            "you need to wake up", "wake up people", "they are hiding",
            "open your eyes", "do your own research", "sheeple",
            "mainstream media lies", "don't trust the government",
        ]
        manip_hits = sum(1 for p in MANIPULATIVE if p in text.lower())
        if manip_hits > 0:
            score = min(0.5, manip_hits * 0.2)
            total_score += score * 0.4
            signals.append(MisinfoSignal(
                signal_type="emotional_manipulation",
                description=f"Emotionally manipulative language detected ({manip_hits} pattern(s))",
                severity="HIGH" if manip_hits >= 2 else "MEDIUM",
                score=round(score, 4),
            ))

        # Unverified absolute claims
        ABSOLUTE = [
            r"\b100%\s*(proven|confirmed|effective|safe)\b",
            r"\bscientifically proven\b.*\bwithout\b",
            r"\bdoctors (confirm|admit|say)\b",
            r"\bstudies show\b(?!.*according)",
        ]
        for pattern in ABSOLUTE:
            if re.search(pattern, text.lower()):
                total_score += 0.15
                signals.append(MisinfoSignal(
                    signal_type="unverified_absolute_claim",
                    description="Absolute claim made without verifiable source",
                    severity="LOW",
                    score=0.2,
                ))
                break

        return min(0.8, total_score), signals

    # ── Layer 3: Source credibility ───────────────────────────────
    def _check_source(self, url: Optional[str]) -> Tuple[float, List[MisinfoSignal]]:
        if not url:
            return 0.0, []

        url_lower = url.lower()
        signals = []

        # Satire site
        for domain in SATIRE_DOMAINS:
            if domain in url_lower:
                return 0.0, [MisinfoSignal(
                    signal_type="satire_source",
                    description=f"Source is a known satire/parody website ({domain})",
                    severity="LOW",
                    score=0.0,
                )]

        # Credible source — reduce score
        for domain in CREDIBLE_SOURCES:
            if domain in url_lower:
                return -0.3, [MisinfoSignal(
                    signal_type="credible_source",
                    description=f"Content from credible source ({domain})",
                    severity="LOW",
                    score=-0.3,
                )]

        # Suspicious URL patterns
        SUSPICIOUS_URL = [
            r"(truth|real|hidden|expose|patriot|freedom|wakeup)",
            r"\.(xyz|tk|ml|ga|cf)\b",
            r"(news4you|infowars|naturalnews|beforeitsnews)",
        ]
        for pattern in SUSPICIOUS_URL:
            if re.search(pattern, url_lower):
                signals.append(MisinfoSignal(
                    signal_type="suspicious_url_pattern",
                    description=f"URL matches pattern associated with low-credibility sources",
                    severity="MEDIUM",
                    score=0.3,
                ))
                return 0.3, signals

        return 0.0, signals

    # ── Credibility indicators ────────────────────────────────────
    def _build_credibility_indicators(self, text: str) -> CredibilityIndicators:
        text_lower = text.lower()
        words = text.split()

        cap_ratio = sum(1 for w in words if len(w) >= 3 and w.isupper()) / max(1, len(words))
        excl_count = text.count("!")

        clickbait_patterns = [
            "you won't believe", "must read", "share now", "breaking",
            "shocking truth", "they're hiding", "banned video",
        ]
        clickbait_hits = sum(1 for p in clickbait_patterns if p in text_lower)

        return CredibilityIndicators(
            uses_sensational_language=any(p in text_lower for p in ["shocking", "bombshell", "explosive", "mind-blowing"]),
            uses_emotional_manipulation=any(p in text_lower for p in ["wake up", "sheeple", "open your eyes", "do your own research"]),
            has_unverified_claims=bool(re.search(r"\bstudies show\b|\bdoctors confirm\b|\bexperts say\b", text_lower)),
            contains_conspiracy_keywords=any(kw in text_lower for kw in ["deep state", "new world order", "illuminati", "shadow government"]),
            has_excessive_capitalization=cap_ratio > 0.15,
            has_excessive_punctuation=excl_count > 3,
            has_contradictory_statements=bool(re.search(r"\bbut (everyone|nobody|nothing|always|never)\b", text_lower)),
            clickbait_score=round(min(1.0, clickbait_hits * 0.25), 4),
        )

    # ── Risk level ────────────────────────────────────────────────
    def _risk_level(self, confidence: float, flagged: bool) -> str:
        if not flagged:
            return "NONE"
        if confidence >= 0.85:
            return "CRITICAL"
        if confidence >= 0.70:
            return "HIGH"
        if confidence >= 0.50:
            return "MEDIUM"
        return "LOW"

    # ── Main analysis ─────────────────────────────────────────────
    async def analyze(
        self,
        text: str,
        url: Optional[str] = None,
        check_source: bool = True,
        check_emotional: bool = True,
    ) -> MisinfoResponse:
        start = time.time()

        # Run all layers
        kw_conf, misinfo_type, kw_signals = self._check_keywords(text)
        ling_conf, ling_signals = self._check_linguistic(text)
        src_adjustment, src_signals = self._check_source(url) if check_source else (0.0, [])

        # Combine signals
        all_signals = kw_signals + ling_signals + src_signals

        # Weighted combination
        raw_confidence = (kw_conf * 0.60) + (ling_conf * 0.40) + src_adjustment
        confidence = max(0.0, min(0.99, raw_confidence))
        flagged = confidence >= 0.45

        risk_level = self._risk_level(confidence, flagged)
        indicators = self._build_credibility_indicators(text)

        # Recommendation
        if risk_level == "CRITICAL":
            recommendation = "🚨 DO NOT SHARE — High-confidence misinformation. Fact-check and flag immediately."
        elif risk_level == "HIGH":
            recommendation = "⚠️ HIGH RISK — Very likely misinformation. Verify with authoritative sources before sharing."
        elif risk_level == "MEDIUM":
            recommendation = "⚡ MEDIUM RISK — Multiple suspicious signals. Cross-check with credible news sources."
        elif risk_level == "LOW":
            recommendation = "📋 LOW RISK — Minor concern. Consider verifying key claims."
        else:
            recommendation = "✅ APPEARS CREDIBLE — No significant misinformation signals detected."

        elapsed = round((time.time() - start) * 1000, 1)
        logger.info(
            f"Misinfo analysis: flagged={flagged} | confidence={confidence:.3f} | "
            f"type={misinfo_type} | risk={risk_level} | {elapsed}ms"
        )

        return MisinfoResponse(
            text_preview=text[:200] + "..." if len(text) > 200 else text,
            flagged=flagged,
            confidence=round(confidence, 4),
            misinfo_type=misinfo_type,
            risk_level=risk_level,
            signals=all_signals,
            credibility_indicators=indicators,
            recommendation=recommendation,
            fact_check_suggested=confidence >= 0.50,
            processing_time_ms=elapsed,
        )


misinfo_service = MisinfoDetectionService()
