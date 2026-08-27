import os
import unittest
from unittest.mock import patch, MagicMock

from graph import EmailGenerationState, scribe_node, compliance_node, analyst_node
from db import init_db, get_connection, upsert_lead_multi_source, get_leads_for_email

class TestEmailPipeline(unittest.TestCase):
    @patch('graph.ChatOpenAI')
    def test_analyst_and_scribe(self, mock_llm_class):
        mock_llm_instance = MagicMock()
        mock_llm_class.return_value = mock_llm_instance
        
        # Mock analyst output
        analyst_response = MagicMock()
        analyst_response.content = "Based on your public footprint across 2 data sources, it seems your Python architecture will struggle with connection limits."
        
        # Mock scribe output
        scribe_response = MagicMock()
        scribe_response.content = (
            "SUBJECT: latency on test.com\n"
            "Our automated engineering observer flagged a potential issue.\n"
            "Based on your public footprint across 2 data sources, it seems your Python architecture will struggle with connection limits.\n"
            "We can help with this.\n"
            "Let's chat."
        )
        
        mock_llm_instance.invoke.side_effect = [analyst_response, scribe_response]
        
        state = EmailGenerationState(
            lead_id=1,
            domain="test.com",
            tech_stack={"Python": "3.11"},
            intent_signals={},
            sources=["Source1", "Source2"],
            analyst_output="",
            final_subject="",
            final_body="",
            status="started",
            error=""
        )
        
        # Run Analyst
        state = analyst_node(state)
        self.assertEqual(state["status"], "analyst_success")
        self.assertIn("struggle", state["analyst_output"])
        
        # Run Scribe
        state = scribe_node(state)
        self.assertEqual(state["status"], "scribe_success")
        self.assertEqual(state["final_subject"], "latency on test.com")
        self.assertIn("Our automated engineering observer flagged", state["final_body"])
        
    def test_compliance_node(self):
        os.environ["NFH_PHYSICAL_ADDRESS"] = "999 Testing Blvd"
        os.environ["NFH_UNSUBSCRIBE_URL"] = "http://test.com/unsub"
        
        state = EmailGenerationState(
            lead_id=1,
            domain="test.com",
            tech_stack={},
            intent_signals={},
            sources=[],
            analyst_output="",
            final_subject="",
            final_body="Test body.",
            status="scribe_success",
            error=""
        )
        
        state = compliance_node(state)
        self.assertEqual(state["status"], "success")
        self.assertIn("999 Testing Blvd", state["final_body"])
        self.assertIn("http://test.com/unsub", state["final_body"])
        self.assertIn("reply STOP", state["final_body"])

class TestDatabaseEligibility(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        
    def test_eligibility_filter(self):
        conn = get_connection()
        # Clean leads first for deterministic test
        with conn.cursor() as cur:
            cur.execute("DELETE FROM leads")
        conn.commit()
        
        # Insert a valid lead
        upsert_lead_multi_source(conn, {
            "company_name": "Valid Corp",
            "domain": "valid.com",
            "source": "Test",
            "country": "US",
            "channel": "EMAIL_CAN_SPAM",
            "intent_signals": {"role": "Backend"}
        })
        
        # Needs tech_stack to be eligible
        with conn.cursor() as cur:
            cur.execute("UPDATE leads SET tech_stack = '{\"Node.js\": \"14\"}'::jsonb WHERE domain = 'valid.com'")
        conn.commit()
        
        leads = get_leads_for_email(conn)
        self.assertEqual(len(leads), 1)
        self.assertEqual(leads[0][1], "valid.com")
        conn.close()

if __name__ == "__main__":
    unittest.main()
