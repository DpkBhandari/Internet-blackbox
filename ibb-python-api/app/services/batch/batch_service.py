"""
Batch Processing Service
- Process up to 500 texts in a single call
- Concurrent async execution with semaphore
- Progress tracking
- Partial failure handling
- Optional Celery async mode
"""

import time
import asyncio
import uuid
from typing import List, Optional, Dict, Any
from loguru import logger

from app.schemas.requests import BatchTextItem
from app.schemas.responses import BatchResponse, BatchItemResult
from app.services.nlp.sentiment_service import sentiment_service
from app.services.misinfo.misinfo_service import misinfo_service
from app.services.topic.topic_service import topic_service
from app.core.config import settings


# ── In-memory job store (replace with Redis in production) ─────────
_job_store: Dict[str, Dict[str, Any]] = {}


class BatchProcessingService:

    def __init__(self):
        # Semaphore limits concurrent AI calls to avoid OOM
        self._semaphore = asyncio.Semaphore(8)

    async def _process_single(
        self,
        item: BatchTextItem,
        index: int,
        include_sentiment: bool = True,
        include_misinfo: bool = True,
        include_virality: bool = True,
        include_topics: bool = True,
    ) -> BatchItemResult:
        start = time.time()

        async with self._semaphore:
            try:
                sentiment_result = None
                misinfo_flagged = None
                misinfo_confidence = None
                virality_score = None
                top_topic = None

                # Run selected analyses concurrently within the item
                tasks = {}

                if include_sentiment:
                    tasks["sentiment"] = sentiment_service.analyze(
                        item.text, include_emotions=False, language=item.language
                    )
                if include_misinfo:
                    tasks["misinfo"] = misinfo_service.analyze(item.text)
                if include_topics:
                    tasks["topic"] = topic_service.classify(item.text, top_k=1)

                if tasks:
                    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
                    result_map = dict(zip(tasks.keys(), results))

                    if "sentiment" in result_map and not isinstance(result_map["sentiment"], Exception):
                        sentiment_result = result_map["sentiment"]

                    if "misinfo" in result_map and not isinstance(result_map["misinfo"], Exception):
                        misinfo_result = result_map["misinfo"]
                        misinfo_flagged = misinfo_result.flagged
                        misinfo_confidence = misinfo_result.confidence

                    if "topic" in result_map and not isinstance(result_map["topic"], Exception):
                        topic_result = result_map["topic"]
                        top_topic = topic_result.top_topic

                # Simple virality score based on sentiment extremity
                if include_virality and sentiment_result:
                    abs_score = abs(sentiment_result.score)
                    words = len(item.text.split())
                    virality_score = int(min(100, abs_score * 50 + min(30, words / 20)))

                elapsed = round((time.time() - start) * 1000, 1)

                return BatchItemResult(
                    id=item.id,
                    index=index,
                    success=True,
                    sentiment=sentiment_result,
                    misinfo_flagged=misinfo_flagged,
                    misinfo_confidence=misinfo_confidence,
                    virality_score=virality_score,
                    top_topic=top_topic,
                    processing_time_ms=elapsed,
                )

            except Exception as e:
                elapsed = round((time.time() - start) * 1000, 1)
                logger.error(f"Batch item {index} failed: {e}")
                return BatchItemResult(
                    id=item.id,
                    index=index,
                    success=False,
                    error=str(e),
                    processing_time_ms=elapsed,
                )

    async def process(
        self,
        items: List[BatchTextItem],
        include_sentiment: bool = True,
        include_misinfo: bool = True,
        include_virality: bool = True,
        include_topics: bool = True,
        async_mode: bool = False,
        priority: str = "normal",
    ) -> BatchResponse:

        if async_mode:
            # Return job ID immediately
            job_id = str(uuid.uuid4())
            _job_store[job_id] = {
                "status": "PENDING",
                "progress": 0,
                "total": len(items),
                "created_at": time.time(),
            }
            # Fire and forget
            asyncio.create_task(
                self._process_async(
                    job_id, items, include_sentiment,
                    include_misinfo, include_virality, include_topics
                )
            )
            logger.info(f"Async batch job {job_id} queued with {len(items)} items")
            return BatchResponse(
                total=len(items),
                succeeded=0,
                failed=0,
                results=[],
                async_mode=True,
                job_id=job_id,
            )

        # Synchronous batch
        start = time.time()
        logger.info(f"Starting sync batch: {len(items)} items")

        # Adjust concurrency based on priority
        max_concurrent = 4 if priority == "low" else 8 if priority == "normal" else 12
        semaphore = asyncio.Semaphore(max_concurrent)

        async def bounded_process(item, idx):
            async with semaphore:
                return await self._process_single(
                    item, idx, include_sentiment,
                    include_misinfo, include_virality, include_topics
                )

        results = await asyncio.gather(
            *[bounded_process(item, i) for i, item in enumerate(items)],
            return_exceptions=False,
        )

        succeeded = sum(1 for r in results if r.success)
        failed = len(results) - succeeded
        total_ms = round((time.time() - start) * 1000, 1)

        logger.info(
            f"Batch complete: {succeeded}/{len(items)} succeeded "
            f"| {failed} failed | {total_ms}ms total"
        )

        return BatchResponse(
            total=len(items),
            succeeded=succeeded,
            failed=failed,
            results=results,
            async_mode=False,
            processing_time_ms=total_ms,
        )

    async def _process_async(
        self,
        job_id: str,
        items: List[BatchTextItem],
        include_sentiment: bool,
        include_misinfo: bool,
        include_virality: bool,
        include_topics: bool,
    ):
        """Background async processing for large batches."""
        _job_store[job_id]["status"] = "PROCESSING"
        results = []
        total = len(items)

        try:
            for i, item in enumerate(items):
                result = await self._process_single(
                    item, i, include_sentiment,
                    include_misinfo, include_virality, include_topics
                )
                results.append(result)
                _job_store[job_id]["progress"] = int((i + 1) / total * 100)

            succeeded = sum(1 for r in results if r.success)
            _job_store[job_id].update({
                "status": "COMPLETED",
                "progress": 100,
                "result": {
                    "total": total,
                    "succeeded": succeeded,
                    "failed": total - succeeded,
                    "results": [r.dict() for r in results],
                },
                "completed_at": time.time(),
            })
            logger.success(f"Async job {job_id} completed: {succeeded}/{total}")

        except Exception as e:
            _job_store[job_id].update({
                "status": "FAILED",
                "error": str(e),
                "completed_at": time.time(),
            })
            logger.error(f"Async job {job_id} failed: {e}")

    def get_job_status(self, job_id: str) -> Optional[Dict[str, Any]]:
        return _job_store.get(job_id)

    def cleanup_old_jobs(self, max_age_seconds: int = 3600):
        cutoff = time.time() - max_age_seconds
        to_delete = [
            jid for jid, job in _job_store.items()
            if job.get("created_at", 0) < cutoff
        ]
        for jid in to_delete:
            del _job_store[jid]
        if to_delete:
            logger.debug(f"Cleaned up {len(to_delete)} old batch jobs")


batch_service = BatchProcessingService()
