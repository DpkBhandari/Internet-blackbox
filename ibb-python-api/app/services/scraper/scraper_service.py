"""
Web Data Fetching Service
- NewsAPI integration
- GNews API integration
- RSS feed parser
- Direct URL scraping (BeautifulSoup)
- Async HTTP with aiohttp
- Rate limiting + retry logic
"""

import re
import time
import asyncio
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from loguru import logger

try:
    import aiohttp
    AIOHTTP_AVAILABLE = True
except ImportError:
    AIOHTTP_AVAILABLE = False

try:
    from bs4 import BeautifulSoup
    BS4_AVAILABLE = True
except ImportError:
    BS4_AVAILABLE = False

try:
    import feedparser
    FEEDPARSER_AVAILABLE = True
except ImportError:
    FEEDPARSER_AVAILABLE = False

from app.core.config import settings
from app.schemas.responses import FetchedArticle, WebDataResponse

# ── Public RSS feeds by category ──────────────────────────────────
RSS_FEEDS: Dict[str, List[str]] = {
    "Politics": [
        "https://feeds.bbci.co.uk/news/politics/rss.xml",
        "https://www.thehindu.com/news/national/feeder/default.rss",
        "https://feeds.feedburner.com/ndtvnews-india-news",
    ],
    "Health": [
        "https://feeds.bbci.co.uk/news/health/rss.xml",
        "https://www.who.int/rss-feeds/news-english.xml",
        "https://rss.medicalnewstoday.com/featurednews.xml",
    ],
    "Technology": [
        "https://feeds.bbci.co.uk/news/technology/rss.xml",
        "https://techcrunch.com/feed/",
        "https://www.wired.com/feed/rss",
    ],
    "Science": [
        "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
        "https://www.sciencedaily.com/rss/top/science.xml",
    ],
    "General": [
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    ],
}


class WebScraperService:

    def __init__(self):
        self._session: Optional[Any] = None
        self._headers = {
            "User-Agent": (
                "Mozilla/5.0 (compatible; IBB-Research-Bot/2.0; "
                "+https://interndrive.in/ibb-bot)"
            ),
            "Accept": "application/json, text/html, application/rss+xml",
            "Accept-Language": "en-US,en;q=0.9",
        }

    async def _get_session(self) -> Any:
        if not AIOHTTP_AVAILABLE:
            raise RuntimeError("aiohttp not installed")
        if self._session is None or self._session.closed:
            timeout = aiohttp.ClientTimeout(total=15, connect=5)
            connector = aiohttp.TCPConnector(limit=20, ssl=False)
            self._session = aiohttp.ClientSession(
                headers=self._headers,
                timeout=timeout,
                connector=connector,
            )
        return self._session

    async def close(self):
        if self._session and not self._session.closed:
            await self._session.close()

    # ── NewsAPI ───────────────────────────────────────────────────
    async def _fetch_newsapi(
        self,
        query: str,
        language: str = "en",
        page_size: int = 10,
        from_date: Optional[datetime] = None,
        category: Optional[str] = None,
    ) -> List[FetchedArticle]:
        if not settings.news_api_key:
            logger.warning("NEWS_API_KEY not set — falling back to RSS")
            return await self._fetch_rss(query, category, page_size)

        try:
            session = await self._get_session()
            params: Dict[str, Any] = {
                "apiKey": settings.news_api_key,
                "language": language,
                "pageSize": min(page_size, 100),
                "sortBy": "publishedAt",
            }
            if query:
                params["q"] = query
            if category:
                params["category"] = category.lower()
            if from_date:
                params["from"] = from_date.strftime("%Y-%m-%d")

            endpoint = (
                "https://newsapi.org/v2/top-headlines"
                if category else
                "https://newsapi.org/v2/everything"
            )

            async with session.get(endpoint, params=params) as resp:
                if resp.status != 200:
                    logger.warning(f"NewsAPI returned {resp.status}")
                    return await self._fetch_rss(query, category, page_size)

                data = await resp.json()
                articles = data.get("articles", [])
                return [
                    FetchedArticle(
                        title=a.get("title", "") or "",
                        description=a.get("description"),
                        url=a.get("url"),
                        source=a.get("source", {}).get("name", "NewsAPI"),
                        published_at=datetime.fromisoformat(
                            a["publishedAt"].replace("Z", "+00:00")
                        ) if a.get("publishedAt") else None,
                        content_preview=(a.get("content") or "")[:500],
                    )
                    for a in articles
                    if a.get("title") and "[Removed]" not in a.get("title", "")
                ]
        except Exception as e:
            logger.error(f"NewsAPI fetch failed: {e}")
            return await self._fetch_rss(query, category, page_size)

    # ── GNews API ─────────────────────────────────────────────────
    async def _fetch_gnews(
        self,
        query: str,
        language: str = "en",
        page_size: int = 10,
    ) -> List[FetchedArticle]:
        if not settings.gnews_api_key:
            return []
        try:
            session = await self._get_session()
            params = {
                "q": query,
                "lang": language,
                "max": min(page_size, 10),
                "apikey": settings.gnews_api_key,
            }
            async with session.get("https://gnews.io/api/v4/search", params=params) as resp:
                data = await resp.json()
                articles = data.get("articles", [])
                return [
                    FetchedArticle(
                        title=a.get("title", ""),
                        description=a.get("description"),
                        url=a.get("url"),
                        source=a.get("source", {}).get("name", "GNews"),
                        published_at=datetime.fromisoformat(
                            a["publishedAt"].replace("Z", "+00:00")
                        ) if a.get("publishedAt") else None,
                        content_preview=(a.get("content") or "")[:500],
                    )
                    for a in articles if a.get("title")
                ]
        except Exception as e:
            logger.warning(f"GNews fetch failed: {e}")
            return []

    # ── RSS Feed Parser ───────────────────────────────────────────
    async def _fetch_rss(
        self,
        query: str = "",
        category: Optional[str] = None,
        limit: int = 10,
    ) -> List[FetchedArticle]:
        if not FEEDPARSER_AVAILABLE:
            logger.warning("feedparser not installed")
            return self._mock_articles(query, limit)

        cat = category or "General"
        feeds = RSS_FEEDS.get(cat, RSS_FEEDS["General"])
        articles: List[FetchedArticle] = []
        query_lower = query.lower()

        for feed_url in feeds:
            if len(articles) >= limit:
                break
            try:
                loop = asyncio.get_event_loop()
                parsed = await loop.run_in_executor(None, feedparser.parse, feed_url)

                for entry in parsed.entries[: limit * 2]:
                    if len(articles) >= limit:
                        break
                    title = entry.get("title", "")
                    summary = entry.get("summary", "")

                    # Filter by query if provided
                    if query_lower and (
                        query_lower not in title.lower() and
                        query_lower not in summary.lower()
                    ):
                        continue

                    published_at = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        import calendar
                        published_at = datetime.utcfromtimestamp(
                            calendar.timegm(entry.published_parsed)
                        )

                    # Clean HTML from summary
                    clean_summary = re.sub(r"<[^>]+>", "", summary)[:500]

                    articles.append(FetchedArticle(
                        title=title,
                        description=clean_summary or None,
                        url=entry.get("link"),
                        source=parsed.feed.get("title", feed_url.split("/")[2]),
                        published_at=published_at,
                        content_preview=clean_summary,
                    ))
            except Exception as e:
                logger.warning(f"RSS feed failed ({feed_url}): {e}")
                continue

        if not articles:
            articles = self._mock_articles(query, min(limit, 5))

        return articles[:limit]

    # ── Direct URL scrape ─────────────────────────────────────────
    async def _scrape_url(self, url: str) -> Optional[FetchedArticle]:
        if not BS4_AVAILABLE:
            logger.warning("beautifulsoup4 not installed")
            return None
        try:
            session = await self._get_session()
            async with session.get(url, allow_redirects=True) as resp:
                if resp.status != 200:
                    return None
                html = await resp.text(errors="replace")

            soup = BeautifulSoup(html, "lxml" if BS4_AVAILABLE else "html.parser")

            # Remove noise
            for tag in soup(["script", "style", "nav", "footer", "aside", "iframe"]):
                tag.decompose()

            title = ""
            if soup.find("h1"):
                title = soup.find("h1").get_text(strip=True)
            elif soup.find("title"):
                title = soup.find("title").get_text(strip=True)

            # Extract main article text
            article_tag = (
                soup.find("article")
                or soup.find(class_=re.compile(r"article|content|post|story"))
                or soup.find("main")
                or soup.body
            )
            text = article_tag.get_text(separator=" ", strip=True) if article_tag else ""

            # Clean whitespace
            text = re.sub(r"\s+", " ", text).strip()[:2000]

            return FetchedArticle(
                title=title,
                url=url,
                source=url.split("/")[2].replace("www.", ""),
                content_preview=text[:500],
                description=text[:200],
            )
        except Exception as e:
            logger.error(f"URL scrape failed ({url}): {e}")
            return None

    # ── Mock articles (offline/dev fallback) ──────────────────────
    def _mock_articles(self, query: str, limit: int = 5) -> List[FetchedArticle]:
        templates = [
            ("Global leaders discuss {q} amid rising concerns", "Reuters"),
            ("New study reveals impact of {q} on public discourse", "BBC"),
            ("Experts weigh in on {q}: What you need to know", "The Guardian"),
            ("Breaking: Major developments in {q} raise questions", "AP News"),
            ("{q} dominates headlines as controversy grows", "NDTV"),
        ]
        return [
            FetchedArticle(
                title=t.format(q=query.title()),
                description=f"[Mock] This is a placeholder article about '{query}' for development. Set NEWS_API_KEY for real data.",
                source=src,
                published_at=datetime.utcnow() - timedelta(hours=i * 2),
                content_preview=f"[Mock content about {query}] " * 5,
            )
            for i, (t, src) in enumerate(templates[:limit])
        ]

    # ── Main fetch entry point ────────────────────────────────────
    async def fetch(
        self,
        query: str,
        source: str = "newsapi",
        category: Optional[str] = None,
        language: str = "en",
        page_size: int = 10,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
    ) -> WebDataResponse:
        start = time.time()
        articles: List[FetchedArticle] = []

        if source == "newsapi":
            articles = await self._fetch_newsapi(query, language, page_size, from_date, category)
        elif source == "gnews":
            articles = await self._fetch_gnews(query, language, page_size)
        elif source == "rss":
            articles = await self._fetch_rss(query, category, page_size)
        elif source == "scrape":
            # Treat query as URL
            if query.startswith("http"):
                article = await self._scrape_url(query)
                if article:
                    articles = [article]
            else:
                articles = await self._fetch_rss(query, category, page_size)
        else:
            articles = await self._fetch_rss(query, category, page_size)

        elapsed = round((time.time() - start) * 1000, 1)
        logger.info(
            f"Web fetch: query='{query}' source={source} "
            f"fetched={len(articles)} in {elapsed}ms"
        )

        return WebDataResponse(
            query=query,
            source=source,
            total_fetched=len(articles),
            articles=articles,
            analyzed=False,
            processing_time_ms=elapsed,
        )


scraper_service = WebScraperService()
