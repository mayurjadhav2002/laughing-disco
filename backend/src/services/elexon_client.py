import logging
import time
from datetime import date, timedelta
from typing import List, Dict, Any, Iterator, Tuple
import httpx

logger = logging.getLogger(__name__)

class ElexonClient:
    """Handles all HTTP communication with the Elexon BMRS API."""
    
    @staticmethod
    def generate_date_chunks(start_date: date, end_date: date, chunk_days: int) -> Iterator[Tuple[date, date]]:
        """Yields date pairs to prevent massive API payloads and timeouts."""
        current = start_date
        while current <= end_date:
            chunk_end = min(current + timedelta(days=chunk_days - 1), end_date)
            yield current, chunk_end
            current = chunk_end + timedelta(days=1)

    @staticmethod
    def fetch_with_retries(url: str, params: dict, max_retries: int = 3) -> List[Dict[str, Any]]:
        """Fetches data with exponential backoff for fault tolerance."""
        for attempt in range(max_retries):
            try:
                with httpx.Client(timeout=15.0) as client:
                    response = client.get(url, params=params)
                    response.raise_for_status()
                    return response.json()
            except (httpx.HTTPError, httpx.TimeoutException) as e:
                logger.warning(f"API fetch failed (Attempt {attempt + 1}/{max_retries}) for {url}: {e}")
                if attempt == max_retries - 1:
                    logger.error(f"Max retries reached. Could not fetch from {url}.")
                    raise e
                time.sleep(2 ** attempt)