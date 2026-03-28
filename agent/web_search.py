"""Google Custom Search integration for real-time web queries."""

import os
import logging
from urllib.parse import urlencode

import requests

logger = logging.getLogger(__name__)

CSE_ENDPOINT = "https://customsearch.googleapis.com/customsearch/v1"


def search(query: str, num_results: int = 5) -> list[dict]:
    """Run a Google Custom Search and return simplified results.

    Returns a list of dicts with keys: title, snippet, link.
    Falls back to an empty list on any error so the agent keeps working.
    """
    api_key = os.getenv("GOOGLE_CSE_API_KEY")
    cx = os.getenv("GOOGLE_CSE_ID")

    if not api_key or not cx:
        logger.warning("GOOGLE_CSE_API_KEY or GOOGLE_CSE_ID not set — skipping web search")
        return []

    params = {
        "key": api_key,
        "cx": cx,
        "q": f"Zagreb {query}",
        "num": min(num_results, 10),
        "gl": "hr",
        "lr": "lang_en",
    }

    try:
        resp = requests.get(CSE_ENDPOINT, params=params, timeout=8)
        resp.raise_for_status()
        data = resp.json()
    except Exception as e:
        logger.error(f"Web search failed: {e}")
        return []

    results = []
    for item in data.get("items", []):
        results.append({
            "title": item.get("title", ""),
            "snippet": item.get("snippet", ""),
            "link": item.get("link", ""),
        })

    logger.info(f"Web search '{query}' returned {len(results)} results")
    return results


def format_results_for_llm(results: list[dict]) -> str:
    """Format search results into a text block for the LLM context."""
    if not results:
        return "No web results found."

    parts = []
    for i, r in enumerate(results, 1):
        parts.append(f"{i}. **{r['title']}**\n   {r['snippet']}\n   Source: {r['link']}")

    return "\n\n".join(parts)
