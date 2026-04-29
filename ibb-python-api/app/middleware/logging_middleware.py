import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from loguru import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log every request with timing, request ID, and status code."""

    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        request.state.request_id = request_id
        start = time.time()

        # Log incoming request
        logger.bind(request_id=request_id).info(
            f"→ {request.method} {request.url.path} "
            f"| ip={request.client.host if request.client else 'unknown'}"
        )

        try:
            response: Response = await call_next(request)
        except Exception as exc:
            elapsed = round((time.time() - start) * 1000, 1)
            logger.bind(request_id=request_id).error(
                f"✗ {request.method} {request.url.path} | "
                f"ERROR: {exc} | {elapsed}ms"
            )
            raise

        elapsed = round((time.time() - start) * 1000, 1)
        level = "warning" if response.status_code >= 400 else "info"
        logger.bind(request_id=request_id).log(
            level.upper(),
            f"← {request.method} {request.url.path} "
            f"| {response.status_code} | {elapsed}ms"
        )

        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{elapsed}ms"
        return response
