from fastapi import Security, HTTPException, status, Request
from fastapi.security import APIKeyHeader
from slowapi import Limiter
from slowapi.util import get_remote_address
from loguru import logger
from typing import Optional
from app.core.config import settings

# ── API Key auth ───────────────────────────────────────────────────
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

VALID_API_KEYS = {settings.api_key, "ibb_internal_service_key"}


async def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    """
    Verify X-API-Key header.
    In production, look up keys from Redis/DB.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="X-API-Key header missing",
            headers={"WWW-Authenticate": "APIKey"},
        )
    if api_key not in VALID_API_KEYS:
        logger.warning(f"Invalid API key attempt: {api_key[:8]}...")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )
    return api_key


# ── Optional auth (for dev — skip key check) ──────────────────────
async def optional_api_key(
    request: Request,
    api_key: str = Security(api_key_header),
) -> Optional[str]:
    if settings.is_dev:
        return "dev_bypass"
    return await verify_api_key(api_key)


# ── Rate limiter (slowapi) ─────────────────────────────────────────
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.rate_limit_per_minute}/minute"],
    storage_uri=settings.redis_url,
)


# ── Utility ───────────────────────────────────────────────────────
from typing import Optional
