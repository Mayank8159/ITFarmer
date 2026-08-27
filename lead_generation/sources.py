import os
import time
import logging
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

class TokenBucketRateLimiter:
    """A simple token bucket rate limiter."""
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate # tokens per second
        self.last_refill = time.monotonic()

    def wait(self, tokens: int = 1):
        while True:
            now = time.monotonic()
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.refill_rate)
            self.last_refill = now

            if self.tokens >= tokens:
                self.tokens -= tokens
                return
            
            time_to_wait = (tokens - self.tokens) / self.refill_rate
            time.sleep(time_to_wait)

class BaseSourceClient:
    def __init__(self, source_name: str, rate_limiter: TokenBucketRateLimiter):
        self.source_name = source_name
        self.rate_limiter = rate_limiter
        self.is_configured = True
        
    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        raise NotImplementedError

class OpenCorporatesClient(BaseSourceClient):
    """
    OpenCorporates API Client.
    Fetches company registry data. Uses free tier.
    Rate limits (without API token) can be strict, so we respect them.
    """
    def __init__(self):
        # e.g. 1 req/sec for public tier
        super().__init__("OpenCorporates", TokenBucketRateLimiter(1, 1.0))
        self.api_token = os.getenv("OPENCORPORATES_API_KEY")
        # if not self.api_token:
        #     self.is_configured = False

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        # In a real scenario, this would query api.opencorporates.com/companies/search?q=query
        # Returning mock data for demonstration/tests as per instructions
        return []

class GitHubClient(BaseSourceClient):
    """
    GitHub REST API Client.
    Requires GITHUB_TOKEN.
    Rate limit for auth'd users: 5000 req/hour (~1.3 req/sec)
    """
    def __init__(self):
        super().__init__("GitHub", TokenBucketRateLimiter(30, 1.3))
        self.token = os.getenv("GITHUB_TOKEN")
        if not self.token:
            self.is_configured = False
        self.headers = {"Authorization": f"Bearer {self.token}", "Accept": "application/vnd.github.v3+json"}

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        org_names = kwargs.get("org_names", [])
        if not self.is_configured or not org_names:
            return []
        
        leads = []
        for org in org_names:
            self.rate_limiter.wait()
            # In a real scenario:
            # resp = requests.get(f"https://api.github.com/users/{org}/repos", headers=self.headers)
            pass
        return leads

class HackerNewsClient(BaseSourceClient):
    """
    Hacker News Algolia API Client.
    Public API, generous rate limits.
    """
    def __init__(self):
        super().__init__("HackerNews", TokenBucketRateLimiter(10, 2.0))

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        
        # Real query would hit hn.algolia.com/api/v1/search?query=Who+is+hiring
        return []

class JobBoardClient(BaseSourceClient):
    """
    Arbeitnow & Remotive Public Job APIs.
    """
    def __init__(self):
        super().__init__("JobBoards", TokenBucketRateLimiter(5, 1.0))

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        return []

class RegistryClient(BaseSourceClient):
    """
    UK Companies House API + US SEC EDGAR API.
    """
    def __init__(self):
        # UK Companies House allows 600 requests per 5 minutes = 2 req/sec
        super().__init__("Registries", TokenBucketRateLimiter(10, 2.0))
        self.uk_api_key = os.getenv("UK_COMPANIES_HOUSE_KEY")
        if not self.uk_api_key:
            self.is_configured = False

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        return []

class GooglePlacesClient(BaseSourceClient):
    """
    Google Places API Client. (Optional)
    """
    def __init__(self):
        super().__init__("GooglePlaces", TokenBucketRateLimiter(10, 5.0))
        self.api_key = os.getenv("GOOGLE_PLACES_API_KEY")
        if not self.api_key:
            self.is_configured = False

    def fetch_leads(self, **kwargs) -> List[Dict[str, Any]]:
        if not self.is_configured:
            return []
        return []
