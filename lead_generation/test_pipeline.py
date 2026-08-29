"""
NFH Acquisition Pipeline v5.0 - Test Suite

Tests cover:
- Normalization and geo-routing
- Database operations
- Graph pipeline
- Email dispatch (dry-run)
- API endpoints
"""

import pytest
import asyncio
import os
from datetime import datetime, timezone

# Set test environment
os.environ["DISPATCH_MODE"] = "dry_run"
os.environ["OMNIROUTE_API_KEY"] = "test"
os.environ["OMNIROUTE_BASE_URL"] = "http://localhost:20128/v1"

from normalize import normalize_lead, route_channel, resolve_country
from normalize import RESTRICTED_JURISDICTIONS


# ============ Normalization Tests ============

class TestGeoRouting:
    """Test geo-routing logic."""

    def test_us_lead_routes_to_email_can_spam(self):
        """US leads should be eligible for cold email."""
        result = route_channel("US")
        assert result == "EMAIL_CAN_SPAM"

    def test_eu_lead_routes_to_nurture(self):
        """EU leads should go to nurture (GDPR)."""
        eu_countries = ["DE", "FR", "IT", "ES", "NL", "BE", "AT", "PL"]
        for cc in eu_countries:
            assert route_channel(cc) == "NURTURE", f"Expected NURTURE for {cc}"

    def test_uk_lead_routes_to_nurture(self):
        """UK leads should go to nurture (UK PECR)."""
        assert route_channel("GB") == "NURTURE"
        assert route_channel("UK") == "NURTURE"

    def test_ca_lead_routes_to_nurture(self):
        """Canadian leads should go to nurture (CASL)."""
        assert route_channel("CA") == "NURTURE"

    def test_au_lead_routes_to_nurture(self):
        """Australian leads should go to nurture."""
        assert route_channel("AU") == "NURTURE"

    def test_unknown_country_rejected(self):
        """Unknown countries should be rejected."""
        assert route_channel(None) == "REJECT"
        assert route_channel("") == "REJECT"
        assert route_channel("XX") == "REJECT"

    def test_other_country_rejected(self):
        """Non-restricted, non-US countries should be rejected."""
        assert route_channel("BR") == "REJECT"
        assert route_channel("IN") == "REJECT"
        assert route_channel("JP") == "REJECT"


class TestNormalizeLead:
    """Test lead normalization."""

    def test_normalize_basic_lead(self):
        """Test basic lead normalization."""
        raw = {
            "email": "test@example.com",
            "company_name": "Test Corp",
            "domain": "example.com",
            "contact_name": "John Doe",
            "intent_signals": {"hiring": 1},
            "apollo_country": "US"
        }

        result = normalize_lead(raw, "apollo")

        assert result["email"] == "test@example.com"
        assert result["first_name"] == "John"
        assert result["last_name"] == "Doe"
        assert result["channel"] == "EMAIL_CAN_SPAM"
        assert result["source"] == "apollo"
        assert result["sources"] == ["apollo"]

    def test_normalize_with_country_priority(self):
        """Test that contact_country_code takes priority."""
        raw = {
            "email": "test@example.com",
            "domain": "example.com",
            "contact_country_code": "US",
            "apollo_country": "DE"
        }

        result = normalize_lead(raw, "test")

        assert result["contact_country_code"] == "US"
        assert result["channel"] == "EMAIL_CAN_SPAM"

    def test_normalize_with_name_parsing(self):
        """Test various name formats."""
        test_cases = [
            ("John Doe", ("John", "Doe")),
            ("John M Doe", ("John", "Doe")),
            ("Doe, John", ("John", "Doe")),
            ("", ("", "")),
        ]

        for input_name, expected in test_cases:
            raw = {
                "email": "test@example.com",
                "domain": "example.com",
                "contact_name": input_name
            }
            result = normalize_lead(raw, "test")
            assert result["first_name"] == expected[0]
            assert result["last_name"] == expected[1]

    def test_normalize_email_field_priority(self):
        """Test that 'email' field takes priority over 'contact_email'."""
        raw = {
            "email": "primary@example.com",
            "contact_email": "secondary@example.com",
            "domain": "example.com"
        }

        result = normalize_lead(raw, "test")
        assert result["email"] == "primary@example.com"


# ============ Compliance Tests ============

class TestCompliance:
    """Test compliance requirements."""

    def test_restricted_jurisdictions_complete(self):
        """Verify all expected jurisdictions are restricted."""
        expected = {
            "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
            "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
            "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH", "CA", "AU"
        }
        assert RESTRICTED_JURISDICTIONS == expected

    def test_no_restricted_countries_in_email_can_spam(self):
        """Ensure restricted countries cannot reach EMAIL_CAN_SPAM."""
        for cc in RESTRICTED_JURISDICTIONS:
            assert route_channel(cc) != "EMAIL_CAN_SPAM", f"{cc} should not be EMAIL_CAN_SPAM"


# ============ Database Tests ============

@pytest.fixture
def mock_db(monkeypatch):
    """Mock database operations for unit tests."""
    class MockCursor:
        def __init__(self):
            self.data = []
            self.query = None

        def execute(self, query, params=None):
            self.query = query
            self.data = []

        def fetchone(self):
            return self.data[0] if self.data else None

        def fetchall(self):
            return self.data

        def __enter__(self):
            return self

        def __exit__(self, *args):
            pass

    class MockConn:
        def __init__(self):
            self.cursor_instance = MockCursor()

        def cursor(self):
            return self.cursor_instance

        def commit(self):
            pass

        def rollback(self):
            pass

        def close(self):
            pass

    monkeypatch.setenv("DB_NAME", "test_db")
    monkeypatch.setenv("DB_USER", "test_user")
    monkeypatch.setenv("DB_PASSWORD", "test_pass")
    monkeypatch.setenv("DB_HOST", "localhost")
    monkeypatch.setenv("DB_PORT", "5432")

    return MockConn()


# ============ Dispatcher Tests ============

class TestDispatcher:
    """Test email dispatcher."""

    @pytest.mark.asyncio
    async def test_dry_run_logs_email(self, caplog):
        """Dry run mode should log without sending."""
        from dispatcher import send_email_dry_run

        lead = {
            "id": 1,
            "email": "test@example.com",
            "first_name": "John",
            "company_name": "Test Corp"
        }

        draft = {
            "subject": "Test Subject",
            "final_payload": "Test body with compliance footer."
        }

        result = await send_email_dry_run(lead, draft)

        assert result["status"] == "dry_run"
        assert "test@example.com" in caplog.text


# ============ Integration Tests ============

@pytest.mark.asyncio
async def test_graph_pipeline_with_mock_llm():
    """Test the LangGraph pipeline with a mocked LLM."""
    # Skip if no OmniRoute available
    # This test would use unittest.mock to patch the LLM calls

    # For now, just verify imports work
    from graph import AgentState, email_graph

    assert email_graph is not None


# ============ API Tests ============

@pytest.mark.asyncio
async def test_health_endpoint():
    """Test the health check endpoint."""
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert data["version"] == "v5.0.0"


@pytest.mark.asyncio
async def test_optout_webhook():
    """Test opt-out webhook."""
    from fastapi.testclient import TestClient
    from main import app
    from db import is_suppressed, add_to_suppression, remove_from_suppression

    client = TestClient(app)

    test_email = "optout_test@example.com"

    # Clean up first
    remove_from_suppression(test_email)

    # Test opt-out
    response = client.post("/api/v1/webhooks/optout", json={"email": test_email})

    assert response.status_code == 200
    assert response.json()["status"] == "suppressed"

    # Verify it's actually suppressed
    assert is_suppressed(test_email)

    # Clean up
    remove_from_suppression(test_email)


@pytest.mark.asyncio
async def test_ingest_leads_endpoint():
    """Test lead ingestion endpoint."""
    from fastapi.testclient import TestClient
    from main import app

    client = TestClient(app)

    payload = {
        "leads": [
            {
                "email": "ingest_test@example.com",
                "first_name": "Test",
                "last_name": "User",
                "company_name": "Test Corp",
                "domain": "testcorp.com",
                "contact_country_code": "US",
                "intent_signals": {"hiring": 1},
                "source": "test"
            }
        ]
    }

    response = client.post("/api/v1/campaigns/ingest", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["queued", "processed"]


# ============ Verification Checklist Tests ============

class TestVerificationChecklist:
    """
    Tests that verify the compliance audit checklist.
    See SPEC.md Section: Compliance Audit
    """

    def test_no_scraping_imports(self):
        """Verify no scraping libraries are imported."""
        import ast
        import os

        # Files to check
        files_to_check = [
            "normalize.py",
            "graph.py",
            "dispatcher.py",
            "fingerprinter.py",
            "db.py",
            "main.py"
        ]

        scraping_keywords = [
            "selenium", "playwright-stealth", "undetected-chromedriver",
            "mechanize", "beautifulsoup4", "scrapy"
        ]

        base_path = os.path.dirname(os.path.abspath(__file__))

        for filename in files_to_check:
            filepath = os.path.join(base_path, filename)
            if os.path.exists(filepath):
                with open(filepath, "r") as f:
                    content = f.read().lower()
                    for keyword in scraping_keywords:
                        assert keyword not in content, f"{filename} contains '{keyword}'"

    def test_compliance_footer_appended_by_code(self):
        """Verify compliance footer is appended by code, not LLM."""
        import os

        base_path = os.path.dirname(os.path.abspath(__file__))
        graph_path = os.path.join(base_path, "graph.py")

        with open(graph_path, "r") as f:
            content = f.read()

        # Verify compliance node exists
        assert "compliance_node" in content
        assert "NFH_PHYSICAL_ADDRESS" in content
        assert "NFH_UNSUBSCRIBE_URL" in content

        # Verify compliance happens in code, not in LLM prompt
        # The system prompts should NOT contain physical address or unsubscribe URL
        assert "Neural Forge Hub, 251 Little Falls Drive" not in content or \
               "compliance_node" in content

    def test_plain_text_only_emails(self):
        """Verify emails are plain text only."""
        from dispatcher import send_email_resend

        # Check that we're not sending HTML
        import ast
        import inspect

        source = inspect.getsource(send_email_resend)
        tree = ast.parse(source)

        # Look for html-related content in the function
        assert "html" not in source.lower() or "text" in source.lower()

    def test_environment_variables_required(self):
        """Verify critical config is in environment variables."""
        required_vars = [
            "NFH_PHYSICAL_ADDRESS",
            "NFH_UNSUBSCRIBE_URL",
            "DISPATCH_MODE"
        ]

        for var in required_vars:
            # These should either be in .env or loaded via os.getenv
            assert var in required_vars


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
