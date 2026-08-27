import urllib.robotparser
from urllib.parse import urlparse
import requests
from Wappalyzer import Wappalyzer, WebPage
import logging

logger = logging.getLogger(__name__)

class Fingerprinter:
    def __init__(self):
        # Initialize Wappalyzer only once as it loads technologies.json
        self.wappalyzer = Wappalyzer.latest()
        self.user_agent = "Mozilla/5.0 (compatible; LeadGenBot/1.0; +http://example.com/bot)"

    def is_allowed_by_robots(self, url: str) -> bool:
        """Check if the URL is allowed to be crawled by robots.txt."""
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        robots_url = f"{base_url}/robots.txt"

        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(robots_url)
        try:
            # Setting a timeout is important for robots.txt fetching
            response = requests.get(robots_url, timeout=5, headers={"User-Agent": self.user_agent})
            if response.status_code == 200:
                rp.parse(response.text.splitlines())
            else:
                # If there is no robots.txt or it's inaccessible, assume allowed unless blocked
                return True
        except Exception as e:
            logger.debug(f"Failed to fetch robots.txt for {base_url}: {e}")
            return True # Fallback to allowed if robots.txt cannot be fetched

        return rp.can_fetch(self.user_agent, url)

    def fingerprint_domain(self, domain: str, last_fetched_at=None) -> tuple[str, dict]:
        """
        Fetch the homepage of the domain, parse headers and HTML with Wappalyzer.
        Respects robots.txt and aborts silently on 403, 429, 503.
        Returns a tuple of (status, tech_stack_dict).
        Status can be: 'skipped_cooldown', 'skipped_robots', 'blocked', 'dead_letter', 'success'
        """
        import datetime
        if last_fetched_at:
            now = datetime.datetime.now(datetime.timezone.utc)
            if last_fetched_at.tzinfo is None:
                last_fetched_at = last_fetched_at.replace(tzinfo=datetime.timezone.utc)
            if (now - last_fetched_at).total_seconds() < 86400:
                logger.info(f"Skipping {domain}: already fetched within the last 24 hours.")
                return "skipped_cooldown", None

        # Ensure domain has scheme
        if not domain.startswith("http://") and not domain.startswith("https://"):
            url = f"https://{domain}"
        else:
            url = domain

        if not self.is_allowed_by_robots(url):
            logger.info(f"Crawling disallowed by robots.txt for {url}")
            return "skipped_robots", None

        headers = {
            "User-Agent": self.user_agent
        }

        try:
            # We don't retry, no proxy rotation, no bot evasion
            response = requests.get(url, headers=headers, timeout=10)
            
            # Abort silently on 403, 429, 503
            if response.status_code in (403, 429, 503):
                logger.info(f"Received status {response.status_code} for {url}. Aborting silently.")
                return "blocked", None
                
            response.raise_for_status()
            
            # Use python-Wappalyzer
            webpage = WebPage.new_from_response(response)
            techs = self.wappalyzer.analyze_with_categories(webpage)
            
            formatted_stack = {
                "framework": [],
                "hosting": [],
                "cms": [],
                "all": list(techs.keys())
            }

            for tech, categories in techs.items():
                for category in categories:
                    cat_name = category.lower()
                    if "framework" in cat_name:
                        formatted_stack["framework"].append(tech)
                    if "hosting" in cat_name or "iaas" in cat_name or "paas" in cat_name:
                        formatted_stack["hosting"].append(tech)
                    if "cms" in cat_name:
                        formatted_stack["cms"].append(tech)

            return "success", formatted_stack

        except requests.exceptions.RequestException as e:
            logger.info(f"Failed to fetch {url}: {e}")
            return "dead_letter", None
        except Exception as e:
            logger.error(f"Error fingerprinting {url}: {e}")
            return "dead_letter", None

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    fingerprinter = Fingerprinter()
    print(fingerprinter.fingerprint_domain("example.com"))
