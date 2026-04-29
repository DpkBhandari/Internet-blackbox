"""Shared text processing utilities."""

import re
import math
import unicodedata
from typing import List, Optional


def clean_text(text: str) -> str:
    """Normalize unicode, remove control chars, collapse whitespace."""
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def truncate_text(text: str, max_chars: int = 512) -> str:
    if len(text) <= max_chars:
        return text
    # Truncate at sentence boundary if possible
    truncated = text[:max_chars]
    last_dot = truncated.rfind(".")
    if last_dot > max_chars * 0.7:
        return truncated[:last_dot + 1]
    return truncated + "..."


def word_count(text: str) -> int:
    return len(text.split())


def sentence_count(text: str) -> int:
    return max(1, len(re.split(r"[.!?]+", text.strip())))


def avg_word_length(text: str) -> float:
    words = text.split()
    if not words:
        return 0.0
    return sum(len(w) for w in words) / len(words)


def syllable_count(word: str) -> int:
    """Approximate syllable count using vowel groups."""
    word = word.lower().strip(".,!?;:")
    vowels = re.findall(r"[aeiou]+", word)
    count = len(vowels)
    if word.endswith("e") and count > 1:
        count -= 1
    return max(1, count)


def flesch_kincaid_grade(text: str) -> float:
    """
    Flesch–Kincaid Grade Level readability score.
    Lower = easier (grade school), Higher = harder (academic).
    """
    sentences = sentence_count(text)
    words = text.split()
    n_words = len(words)
    if n_words == 0 or sentences == 0:
        return 0.0
    n_syllables = sum(syllable_count(w) for w in words)
    grade = (
        0.39 * (n_words / sentences)
        + 11.8 * (n_syllables / n_words)
        - 15.59
    )
    return round(max(1.0, min(20.0, grade)), 2)


def detect_language_hint(text: str) -> str:
    """
    Very basic language hint based on character ranges.
    For production use langdetect or langid.
    """
    devanagari = len(re.findall(r"[\u0900-\u097F]", text))
    arabic = len(re.findall(r"[\u0600-\u06FF]", text))
    chinese = len(re.findall(r"[\u4E00-\u9FFF]", text))
    latin = len(re.findall(r"[a-zA-Z]", text))

    if devanagari > latin * 0.3:
        return "hi"
    if arabic > latin * 0.3:
        return "ar"
    if chinese > 10:
        return "zh"
    return "en"


def extract_urls(text: str) -> List[str]:
    pattern = r"https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+"
    return re.findall(pattern, text)


def extract_hashtags(text: str) -> List[str]:
    return re.findall(r"#(\w+)", text)


def extract_mentions(text: str) -> List[str]:
    return re.findall(r"@(\w+)", text)


def toxicity_score_heuristic(text: str) -> float:
    """
    Heuristic toxicity score based on profanity patterns and aggressiveness.
    Replace with 'detoxify' library in production.
    """
    TOXIC_PATTERNS = [
        r"\b(kill|murder|die|hate|idiot|stupid|moron|loser|trash|scum)\b",
        r"\b(f[*u]ck|sh[*i]t|a[*s]shole|b[*i]tch|damn|hell)\b",
        r"[A-Z]{4,}",  # shouting
        r"!{3,}",       # excessive exclamation
    ]
    text_lower = text.lower()
    hits = 0
    for pattern in TOXIC_PATTERNS:
        hits += len(re.findall(pattern, text_lower))
    return round(min(1.0, hits * 0.12), 4)


def summarize_text(text: str, max_sentences: int = 3) -> str:
    """
    Extractive summarization — picks top sentences by position + length.
    Use transformers summarization pipeline for abstractive in production.
    """
    sentences = re.split(r"(?<=[.!?])\s+", text.strip())
    sentences = [s.strip() for s in sentences if len(s.split()) >= 5]
    if not sentences:
        return text[:300]

    # Score by position (lead bias) and length
    scored = []
    n = len(sentences)
    for i, s in enumerate(sentences):
        position_score = 1.0 - (i / max(1, n))  # earlier = higher
        length_score = min(1.0, len(s.split()) / 30)  # prefer ~30 words
        scored.append((position_score * 0.6 + length_score * 0.4, i, s))

    scored.sort(reverse=True)
    top = sorted(scored[:max_sentences], key=lambda x: x[1])
    return " ".join(s for _, _, s in top)
