"""
Apollo.io API Client for NFH Lead Generation Pipeline v5.0

Fetches leads based on hiring intent signals and engineering personas.
Uses async httpx for API calls.
"""

import os
import httpx
import logging
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


class ApolloClient:
    """
    Client for interacting with the Apollo.io API.

    API Docs: https://apolloio.github.io/apollo-api-docs/
    """

    BASE_URL = "https://api.apollo.io/v1"

    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv("APOLLO_API_KEY")
        if not self.api_key:
            raise ValueError("APOLLO_API_KEY not set in environment variables")

        self.headers = {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "X-Api-Key": self.api_key
        }

    async def _get(self, endpoint: str, params: dict = None) -> dict:
        """Make async GET request to Apollo API."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.BASE_URL}/{endpoint}",
                headers=self.headers,
                params=params
            )
            response.raise_for_status()
            return response.json()

    async def _post(self, endpoint: str, json: dict = None) -> dict:
        """Make async POST request to Apollo API."""
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.BASE_URL}/{endpoint}",
                headers=self.headers,
                json=json
            )
            response.raise_for_status()
            return response.json()

    async def search_people(
        self,
        keywords: List[str] = None,
        titles: List[str] = None,
        page: int = 1,
        per_page: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search for people using mixed search.

        Args:
            keywords: Job titles or keywords to search
            titles: Specific job titles (e.g., CTO, VP Engineering)
            page: Page number
            per_page: Results per page (max 100)

        Returns:
            List of person records
        """
        payload = {
            "api_key": self.api_key,
            "q_keywords": " ".join(keywords) if keywords else None,
            "person_titles": titles or ["CTO", "VP Engineering", "Director of Engineering", "Head of Engineering"],
            "page": page,
            "per_page": min(per_page, 100)
        }

        # Remove None values
        payload = {k: v for k, v in payload.items() if v is not None}

        try:
            data = await self._post("mixed_people/search", json=payload)
            return data.get("people", [])
        except httpx.HTTPStatusError as e:
            logger.error(f"Apollo API error: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            logger.error(f"Error searching people: {e}")
            return []

    async def search_people_paginated(
        self,
        keywords: List[str] = None,
        titles: List[str] = None,
        max_results: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        Search for people with automatic pagination.

        Args:
            keywords: Job titles or keywords
            titles: Specific titles
            max_results: Maximum total results

        Returns:
            All person records found
        """
        all_people = []
        page = 1
        per_page = 100

        while len(all_people) < max_results:
            people = await self.search_people(
                keywords=keywords,
                titles=titles,
                page=page,
                per_page=per_page
            )

            if not people:
                break

            all_people.extend(people)

            if len(people) < per_page:
                break

            page += 1

        return all_people[:max_results]

    async def enrich_person(self, email: str = None, first_name: str = None,
                           last_name: str = None, domain: str = None) -> Optional[Dict]:
        """
        Enrich person data by email or name + domain.

        Args:
            email: Email address
            first_name: First name
            last_name: Last name
            domain: Company domain

        Returns:
            Enriched person data
        """
        payload = {
            "api_key": self.api_key
        }

        if email:
            payload["email"] = email
        else:
            payload["first_name"] = first_name
            payload["last_name"] = last_name
            payload["domain"] = domain

        try:
            data = await self._post("people/match", json=payload)
            return data.get("person")
        except Exception as e:
            logger.error(f"Error enriching person: {e}")
            return None

    def search_leads(self, hiring_titles: List[str]) -> List[Dict[str, Any]]:
        """
        Synchronous wrapper for searching leads.

        This is kept for backward compatibility with existing code.

        Args:
            hiring_titles: List of job titles to search

        Returns:
            List of normalized lead records
        """
        import asyncio

        try:
            people = asyncio.run(self.search_people_paginated(
                keywords=hiring_titles,
                max_results=100
            ))

            leads = []
            for person in people:
                org = person.get("organization") or {}

                # Extract intent data
                intent_data = org.get("intent_data", {})
                apollo_intent = {
                    "intent_topics": intent_data.get("intent_topics", []),
                    "intent_score": intent_data.get("score"),
                    "last_signal_date": intent_data.get("last_signal_date")
                }

                # Get country from contact
                contact_country = person.get("country_code") or org.get("country_code")

                # Normalize to our lead format
                lead = {
                    "company_name": org.get("name"),
                    "domain": org.get("primary_domain"),
                    "contact_name": f"{person.get('first_name', '')} {person.get('last_name', '')}".strip(),
                    "contact_email": person.get("email"),
                    "intent_signals": {
                        "hiring_for": hiring_titles,
                        "apollo_intent": apollo_intent
                    },
                    "country": contact_country
                }

                # Only add if we have minimum required fields
                if lead["domain"] and lead["contact_email"]:
                    leads.append(lead)

            logger.info(f"Returning {len(leads)} leads from Apollo")
            return leads

        except Exception as e:
            logger.error(f"Error in search_leads: {e}")
            return []

    async def get_organization(self, domain: str) -> Optional[Dict]:
        """
        Get organization details by domain.

        Args:
            domain: Company domain

        Returns:
            Organization details
        """
        params = {"domain": domain}

        try:
            data = await self._get("organizations/search", params=params)
            orgs = data.get("organizations", [])
            return orgs[0] if orgs else None
        except Exception as e:
            logger.error(f"Error getting organization: {e}")
            return None

    async def get_organization_technologies(self, domain: str) -> List[str]:
        """
        Get technologies used by an organization.

        Args:
            domain: Company domain

        Returns:
            List of technology names
        """
        try:
            org = await self.get_organization(domain)
            if org:
                return org.get("technologies", [])
            return []
        except Exception as e:
            logger.error(f"Error getting technologies: {e}")
            return []


# Sync wrapper for Prefect tasks
def get_apollo_client() -> ApolloClient:
    """Get configured Apollo client."""
    return ApolloClient()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    api_key = os.getenv("APOLLO_API_KEY")
    if not api_key:
        print("ERROR: APOLLO_API_KEY not set. Exiting.")
        exit(1)

    client = ApolloClient(api_key=api_key)

    # Test search
    print("Testing Apollo client...")
    leads = client.search_leads(["Backend Engineer", "ML Engineer"])
    print(f"Found {len(leads)} leads")

    if leads:
        print(f"\nSample lead:")
        print(f"  Company: {leads[0].get('company_name')}")
        print(f"  Domain: {leads[0].get('domain')}")
        print(f"  Email: {leads[0].get('contact_email')}")
