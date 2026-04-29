from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, validator
from typing import List, Optional
from functools import lru_cache
import os


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── App ───────────────────────────────────────────────────────
    app_name: str = "IBB-AI-Service"
    app_version: str = "2.0.0"
    environment: str = "development"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 2
    log_level: str = "INFO"

    # ── Security ──────────────────────────────────────────────────
    secret_key: str = "dev_secret_change_in_production_min_32_chars!!"
    api_key: str = "ibb_ai_internal_key"
    allowed_hosts: str = "localhost,127.0.0.1"
    cors_origins: str = "http://localhost:5000,http://localhost:5173"

    # ── Redis ─────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"
    cache_ttl_seconds: int = 300

    # ── MongoDB ───────────────────────────────────────────────────
    mongo_uri: str = "mongodb://localhost:27017/internet_black_box"
    mongo_db: str = "internet_black_box"

    # ── Backend ───────────────────────────────────────────────────
    backend_url: str = "http://localhost:5000"
    backend_api_key: str = "ibb_internal_service_key"

    # ── NLP Models ────────────────────────────────────────────────
    sentiment_model: str = "distilbert-base-uncased-finetuned-sst-2-english"
    ner_model: str = "en_core_web_sm"
    topic_model: str = "facebook/bart-large-mnli"
    misinfo_model: str = "rule_based"
    model_cache_dir: str = "./cache/models"
    use_gpu: bool = False
    batch_size: int = 32
    max_text_length: int = 512
    device: str = "cpu"

    # ── News APIs ─────────────────────────────────────────────────
    news_api_key: str = ""
    gnews_api_key: str = ""
    guardian_api_key: str = ""

    # ── Rate Limiting ─────────────────────────────────────────────
    rate_limit_per_minute: int = 120
    rate_limit_burst: int = 20

    # ── Sentry ────────────────────────────────────────────────────
    sentry_dsn: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def allowed_hosts_list(self) -> List[str]:
        return [h.strip() for h in self.allowed_hosts.split(",")]

    @property
    def is_dev(self) -> bool:
        return self.environment == "development"

    @property
    def is_prod(self) -> bool:
        return self.environment == "production"

    @property
    def torch_device(self) -> str:
        if self.use_gpu:
            try:
                import torch
                return "cuda" if torch.cuda.is_available() else "cpu"
            except ImportError:
                return "cpu"
        return "cpu"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
