import os
import requests
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

class ApolloClient:
    """Client for interacting with the Apollo.io API to source leads."""

    BASE_URL = "https://api.apollo.io/v1"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("APOLLO_API_KEY")
        if not self.api_key:
            raise ValueError("APOLLO_API_KEY is not set.")
        
        self.headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache"
        }

    def search_leads(self, hiring_titles: List[str]) -> List[Dict[str, Any]]:
        """
        Search for leads based on hiring intent signals (e.g. open roles).
        Uses the /mixed_people/search endpoint as it allows people + company search.
        
        Note: The actual Apollo API allows searching by intent or hiring signals via specific
        payload parameters. This is a simplified representation of how to query those signals.
        """
        url = f"{self.BASE_URL}/mixed_people/search"
        all_leads = []

        base_payload = {
            "api_key": self.api_key,
            "q_organization_keyword_tags": hiring_titles,
            "person_titles": ["CTO", "VP Engineering", "Director of Engineering"], # Target personas
            "per_page": 100
        }

        page = 1
        while True:
            logger.info(f"Fetching Apollo leads page {page}...")
            payload = {**base_payload, "page": page}
            
            try:
                response = requests.post(url, headers=self.headers, json=payload)
                response.raise_for_status()
                data = response.json()
                
                people = data.get("people", [])
                if not people:
                    break

                for person in people:
                    org = person.get("organization") or {}
                    # Extract explicit intent fields to avoid storing unnecessary raw blobs
                    raw_intent = org.get("intent_data", {})
                    apollo_intent = {
                        "intent_topics": raw_intent.get("intent_topics", []),
                        "intent_score": raw_intent.get("score"),
                        "last_signal_date": raw_intent.get("last_signal_date")
                    }

                    # Deduplicate/format data before returning
                    lead = {
                        "company_name": org.get("name"),
                        "domain": org.get("primary_domain"),
                        "contact_name": f"{person.get('first_name', '')} {person.get('last_name', '')}".strip(),
                        "contact_email": person.get("email"),
                        "intent_signals": {
                            "hiring_for": hiring_titles,
                            "apollo_intent": apollo_intent
                        }
                    }
                    
                    # Ensure we have the minimum required data
                    if lead["domain"] and lead["contact_email"]:
                        all_leads.append(lead)
                
                pagination = data.get("pagination", {})
                total_pages = pagination.get("total_pages", 1)
                
                if page >= total_pages:
                    break
                    
                page += 1
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"Error fetching from Apollo API: {e}")
                if response.content:
                    logger.error(f"Response content: {response.content}")
                break

        return all_leads

if __name__ == "__main__":
    # Simple manual test
    import sys
    logging.basicConfig(level=logging.INFO)
    
    api_key = os.getenv("APOLLO_API_KEY")
    if not api_key:
        print("ERROR: APOLLO_API_KEY environment variable is not set. Exiting.")
        sys.exit(1)
        
    client = ApolloClient(api_key=api_key)
    print("Apollo Client Initialized.")
