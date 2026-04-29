"""Entry point for uvicorn."""
import uvicorn
from app.main import app
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.is_dev,
        workers=1 if settings.is_dev else settings.workers,
        log_level=settings.log_level.lower(),
        access_log=False,  # handled by our middleware
        proxy_headers=True,
        forwarded_allow_ips="*",
    )
