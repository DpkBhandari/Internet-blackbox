"""
Gunicorn configuration for production deployment.
Run: gunicorn -c gunicorn.conf.py app.main:app
"""

import multiprocessing
import os

# ── Server socket ──────────────────────────────────────────────────
bind = f"0.0.0.0:{os.getenv('PORT', '8000')}"
backlog = 2048

# ── Worker processes ───────────────────────────────────────────────
# For CPU-bound ML workloads: 2-4 workers max (avoid OOM from model copies)
workers = int(os.getenv("WORKERS", min(4, multiprocessing.cpu_count())))
worker_class = "uvicorn.workers.UvicornWorker"
worker_connections = 1000
threads = 2

# ── Timeouts ───────────────────────────────────────────────────────
timeout = 120        # Long timeout for ML inference on large batches
keepalive = 5
graceful_timeout = 30

# ── Logging ────────────────────────────────────────────────────────
loglevel = os.getenv("LOG_LEVEL", "info").lower()
accesslog = "-"      # stdout
errorlog = "-"       # stderr
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" %(D)s μs'

# ── Process naming ─────────────────────────────────────────────────
proc_name = "ibb-ai-service"

# ── Lifecycle hooks ────────────────────────────────────────────────
def on_starting(server):
    print(f"[gunicorn] Starting {proc_name} with {workers} workers")

def post_fork(server, worker):
    print(f"[gunicorn] Worker {worker.pid} started")

def worker_exit(server, worker):
    print(f"[gunicorn] Worker {worker.pid} exiting")

def on_exit(server):
    print(f"[gunicorn] {proc_name} shutting down")
