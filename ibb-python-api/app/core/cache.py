import json
import hashlib
import functools
from typing import Any, Optional, Callable
from loguru import logger

try:
    import redis.asyncio as aioredis
    REDIS_AVAILABLE = True
except ImportError:
    REDIS_AVAILABLE = False

from app.core.config import settings


class CacheService:
    """Async Redis cache service with fallback to in-memory dict."""

    def __init__(self):
        self._client: Optional[Any] = None
        self._memory: dict = {}  # fallback
        self._connected = False

    async def connect(self):
        if not REDIS_AVAILABLE:
            logger.warning("redis not installed — using in-memory cache")
            return
        try:
            self._client = aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
                socket_connect_timeout=3,
                socket_timeout=3,
            )
            await self._client.ping()
            self._connected = True
            logger.info(f"Redis cache connected: {settings.redis_url}")
        except Exception as e:
            logger.warning(f"Redis unavailable ({e}) — falling back to in-memory cache")
            self._client = None
            self._connected = False

    async def get(self, key: str) -> Optional[Any]:
        try:
            if self._connected and self._client:
                raw = await self._client.get(f"ibb:ai:{key}")
                if raw:
                    logger.debug(f"Cache HIT: {key}")
                    return json.loads(raw)
            elif key in self._memory:
                logger.debug(f"Memory cache HIT: {key}")
                return self._memory[key]
        except Exception as e:
            logger.error(f"Cache GET error: {e}")
        return None

    async def set(self, key: str, value: Any, ttl: int = None) -> None:
        ttl = ttl or settings.cache_ttl_seconds
        try:
            serialized = json.dumps(value, default=str)
            if self._connected and self._client:
                await self._client.setex(f"ibb:ai:{key}", ttl, serialized)
            else:
                self._memory[key] = value
                if len(self._memory) > 1000:
                    oldest = list(self._memory.keys())[0]
                    del self._memory[oldest]
        except Exception as e:
            logger.error(f"Cache SET error: {e}")

    async def delete(self, key: str) -> None:
        try:
            if self._connected and self._client:
                await self._client.delete(f"ibb:ai:{key}")
            elif key in self._memory:
                del self._memory[key]
        except Exception as e:
            logger.error(f"Cache DELETE error: {e}")

    async def flush_pattern(self, pattern: str) -> int:
        count = 0
        try:
            if self._connected and self._client:
                keys = await self._client.keys(f"ibb:ai:{pattern}")
                if keys:
                    count = await self._client.delete(*keys)
        except Exception as e:
            logger.error(f"Cache FLUSH error: {e}")
        return count

    async def ping(self) -> bool:
        try:
            if self._connected and self._client:
                return await self._client.ping()
        except Exception:
            pass
        return False

    async def disconnect(self):
        if self._client:
            await self._client.aclose()
            self._connected = False


cache = CacheService()


def make_cache_key(*args, **kwargs) -> str:
    """Generate deterministic cache key from arguments."""
    raw = json.dumps({"args": args, "kwargs": kwargs}, sort_keys=True, default=str)
    return hashlib.md5(raw.encode()).hexdigest()


def cached(ttl: int = 300, key_prefix: str = ""):
    """Async cache decorator for endpoint handlers."""
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Build cache key from function name + args
            key = f"{key_prefix or func.__name__}:{make_cache_key(*args, **kwargs)}"
            cached_result = await cache.get(key)
            if cached_result is not None:
                return cached_result
            result = await func(*args, **kwargs)
            await cache.set(key, result, ttl)
            return result
        return wrapper
    return decorator
