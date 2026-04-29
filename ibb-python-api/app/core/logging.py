import sys
import os
from loguru import logger
from app.core.config import settings


def setup_logging() -> None:
    """Configure loguru for structured logging with rotation."""
    logger.remove()  # Remove default handler

    # ── Console handler ────────────────────────────────────────────
    log_format = (
        "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | "
        "<level>{level: <8}</level> | "
        "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | "
        "<level>{message}</level>"
    )

    if settings.debug:
        log_format += " | <dim>{extra}</dim>"

    logger.add(
        sys.stdout,
        format=log_format,
        level=settings.log_level,
        colorize=True,
        enqueue=True,
    )

    # ── File handler — combined ────────────────────────────────────
    os.makedirs("logs", exist_ok=True)

    logger.add(
        "logs/combined_{time:YYYY-MM-DD}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}",
        level="DEBUG",
        rotation="100 MB",
        retention="30 days",
        compression="zip",
        enqueue=True,
    )

    # ── File handler — errors only ─────────────────────────────────
    logger.add(
        "logs/error_{time:YYYY-MM-DD}.log",
        format="{time:YYYY-MM-DD HH:mm:ss.SSS} | {level: <8} | {name}:{function}:{line} | {message}\n{exception}",
        level="ERROR",
        rotation="50 MB",
        retention="60 days",
        compression="zip",
        enqueue=True,
        backtrace=True,
        diagnose=settings.debug,
    )

    # ── Service-specific loggers ───────────────────────────────────
    logger.add(
        "logs/nlp_{time:YYYY-MM-DD}.log",
        format="{time} | {level} | {message}",
        level="INFO",
        rotation="50 MB",
        retention="14 days",
        filter=lambda record: "nlp" in record["name"] or "sentiment" in record["message"].lower(),
        enqueue=True,
    )

    logger.info(
        f"Logging configured | env={settings.environment} | level={settings.log_level}"
    )


# ── Module-level child loggers ─────────────────────────────────────
def get_logger(name: str):
    return logger.bind(service=name)


# Named loggers per module
nlp_logger = get_logger("nlp")
sentiment_logger = get_logger("sentiment")
trend_logger = get_logger("trend")
misinfo_logger = get_logger("misinfo")
topic_logger = get_logger("topic")
scraper_logger = get_logger("scraper")
batch_logger = get_logger("batch")
cache_logger = get_logger("cache")
api_logger = get_logger("api")
