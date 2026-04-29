"""
Viral Trend Detection Service
- Z-score based spike detection
- Rolling baseline with adaptive window
- Trend direction (rising/falling/stable/volatile)
- Virality scoring (0-100)
- Optional ARIMA forecast
"""

import math
import statistics
import time
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timedelta
from loguru import logger
from app.schemas.requests import TimeSeriesPoint
from app.schemas.responses import (
    TrendDetectResponse, SpikePoint, TrendMetrics
)


SEVERITY_THRESHOLDS = {
    "LOW":      (1.5, 2.0),
    "MEDIUM":   (2.0, 3.0),
    "HIGH":     (3.0, 4.5),
    "CRITICAL": (4.5, float("inf")),
}

VIRALITY_LEVELS = [
    (90, "VIRAL"),
    (70, "TRENDING"),
    (50, "RISING"),
    (0,  "STABLE"),
]


class TrendDetectionService:

    # ── Core spike detection ───────────────────────────────────────
    def _detect_spikes(
        self,
        values: List[float],
        timestamps: List[datetime],
        sensitivity: float,
        window_size: int,
    ) -> List[SpikePoint]:
        """
        Modified Z-score spike detection using rolling median and MAD.
        More robust than mean/std for non-normal distributions.
        """
        spikes: List[SpikePoint] = []
        n = len(values)

        for i in range(window_size, n):
            window = values[max(0, i - window_size): i]
            current = values[i]

            if len(window) < 2:
                continue

            median = statistics.median(window)
            # Median Absolute Deviation (MAD)
            mad = statistics.median([abs(v - median) for v in window])
            mad = mad or 0.0001  # prevent division by zero

            # Modified Z-score
            z_score = 0.6745 * (current - median) / mad

            baseline = statistics.mean(window)
            spike_ratio = current / baseline if baseline > 0 else 1.0

            if z_score >= sensitivity:
                severity = "LOW"
                for sev, (lo, hi) in SEVERITY_THRESHOLDS.items():
                    if lo <= z_score < hi:
                        severity = sev
                        break
                if z_score >= SEVERITY_THRESHOLDS["CRITICAL"][0]:
                    severity = "CRITICAL"

                spikes.append(SpikePoint(
                    timestamp=timestamps[i],
                    value=round(current, 4),
                    zscore=round(z_score, 4),
                    baseline=round(baseline, 4),
                    spike_ratio=round(spike_ratio, 4),
                    severity=severity,
                ))

        return spikes

    # ── Trend metrics ──────────────────────────────────────────────
    def _compute_metrics(
        self,
        values: List[float],
        timestamps: List[datetime],
    ) -> TrendMetrics:
        if not values:
            return TrendMetrics(
                mean=0, std=0, min=0, max=0,
                trend_direction="STABLE", trend_slope=0,
                coefficient_of_variation=0,
            )

        mean_val = statistics.mean(values)
        std_val = statistics.stdev(values) if len(values) > 1 else 0
        min_val = min(values)
        max_val = max(values)
        cv = std_val / mean_val if mean_val > 0 else 0

        # Linear regression slope (direction)
        slope = self._linear_slope(values)

        # Autocorrelation lag-1
        autocorr = None
        if len(values) >= 4:
            n = len(values)
            mean = mean_val
            numerator = sum((values[i] - mean) * (values[i - 1] - mean) for i in range(1, n))
            denominator = sum((v - mean) ** 2 for v in values)
            autocorr = round(numerator / denominator, 4) if denominator > 0 else 0

        # Direction classification
        rel_slope = slope / mean_val if mean_val > 0 else 0
        if cv > 0.4:
            direction = "VOLATILE"
        elif rel_slope > 0.05:
            direction = "RISING"
        elif rel_slope < -0.05:
            direction = "FALLING"
        else:
            direction = "STABLE"

        return TrendMetrics(
            mean=round(mean_val, 4),
            std=round(std_val, 4),
            min=round(min_val, 4),
            max=round(max_val, 4),
            trend_direction=direction,
            trend_slope=round(slope, 6),
            coefficient_of_variation=round(cv, 4),
            autocorrelation=autocorr,
        )

    def _linear_slope(self, values: List[float]) -> float:
        """Least-squares slope of the value series."""
        n = len(values)
        if n < 2:
            return 0.0
        x_mean = (n - 1) / 2
        y_mean = sum(values) / n
        numerator = sum((i - x_mean) * (values[i] - y_mean) for i in range(n))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        return numerator / denominator if denominator else 0.0

    # ── Virality scoring ───────────────────────────────────────────
    def _compute_virality_score(
        self,
        spikes: List[SpikePoint],
        metrics: TrendMetrics,
        n_points: int,
    ) -> Tuple[int, str]:
        score = 0.0

        # Spike contribution
        spike_weights = {"LOW": 5, "MEDIUM": 15, "HIGH": 30, "CRITICAL": 50}
        spike_score = sum(spike_weights.get(s.severity, 0) for s in spikes)
        score += min(60, spike_score)

        # Trend direction
        direction_scores = {"RISING": 20, "VOLATILE": 15, "STABLE": 0, "FALLING": -5}
        score += direction_scores.get(metrics.trend_direction, 0)

        # Growth rate (max / mean ratio)
        if metrics.mean > 0:
            growth_ratio = metrics.max / metrics.mean
            score += min(20, (growth_ratio - 1) * 10)

        score = max(0, min(100, score))
        int_score = int(round(score))

        level = "STABLE"
        for threshold, lv in VIRALITY_LEVELS:
            if int_score >= threshold:
                level = lv
                break

        return int_score, level

    # ── Forecast (simple linear projection) ───────────────────────
    def _forecast(
        self, values: List[float], timestamps: List[datetime], steps: int = 3
    ) -> Optional[Dict[str, Any]]:
        if len(values) < 5:
            return None
        try:
            slope = self._linear_slope(values)
            last_val = values[-1]
            last_ts = timestamps[-1]
            # Infer interval from last two timestamps
            if len(timestamps) >= 2:
                interval = (timestamps[-1] - timestamps[-2]).total_seconds()
            else:
                interval = 3600  # default 1 hour

            forecasted = []
            for i in range(1, steps + 1):
                proj_val = max(0, last_val + slope * i)
                proj_ts = last_ts + timedelta(seconds=interval * i)
                forecasted.append({
                    "timestamp": proj_ts.isoformat(),
                    "predicted_value": round(proj_val, 4),
                    "step": i,
                })
            return {"method": "linear_projection", "steps": steps, "points": forecasted}
        except Exception as e:
            logger.warning(f"Forecast failed: {e}")
            return None

    # ── Recommendation ─────────────────────────────────────────────
    def _build_recommendation(
        self, virality_level: str, spikes: List[SpikePoint], metrics: TrendMetrics
    ) -> str:
        if virality_level == "VIRAL":
            critical = [s for s in spikes if s.severity == "CRITICAL"]
            return (
                f"🚨 VIRAL ALERT — {len(critical)} critical spike(s) detected. "
                f"Content is spreading at {round(max((s.spike_ratio for s in spikes), default=1), 1)}× baseline. "
                "Immediate monitoring and misinfo cross-check recommended."
            )
        elif virality_level == "TRENDING":
            return (
                f"⚠️ TRENDING — {len(spikes)} spike(s) detected. "
                f"Content is gaining traction ({metrics.trend_direction.lower()} direction). "
                "Monitor for escalation over next 2 hours."
            )
        elif virality_level == "RISING":
            return "📈 RISING — Moderate growth detected. Continue monitoring. No immediate action required."
        else:
            return "✅ STABLE — No significant viral activity. Content spreading within normal parameters."

    # ── Main entry point ───────────────────────────────────────────
    async def detect(
        self,
        series: List[TimeSeriesPoint],
        metric: str = "shares",
        sensitivity: float = 2.0,
        window_size: int = 5,
        topic: Optional[str] = None,
    ) -> TrendDetectResponse:
        start = time.time()

        # Sort by timestamp
        sorted_series = sorted(series, key=lambda p: p.timestamp)
        values = [p.value for p in sorted_series]
        timestamps = [p.timestamp for p in sorted_series]

        # Detect spikes
        spikes = self._detect_spikes(values, timestamps, sensitivity, window_size)

        # Compute metrics
        metrics = self._compute_metrics(values, timestamps)

        # Virality scoring
        virality_score, virality_level = self._compute_virality_score(spikes, metrics, len(values))

        # Forecast
        prediction = self._forecast(values, timestamps)

        # Recommendation
        recommendation = self._build_recommendation(virality_level, spikes, metrics)

        elapsed = round((time.time() - start) * 1000, 1)
        logger.info(
            f"Trend analysis: {len(series)} points | "
            f"{len(spikes)} spikes | level={virality_level} | score={virality_score}"
        )

        return TrendDetectResponse(
            topic=topic,
            metric=metric,
            series_length=len(series),
            spikes_detected=len(spikes),
            spikes=spikes,
            virality_level=virality_level,
            virality_score=virality_score,
            trend_metrics=metrics,
            prediction=prediction,
            recommendation=recommendation,
            processing_time_ms=elapsed,
        )


trend_service = TrendDetectionService()
