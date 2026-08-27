import unittest
from unittest.mock import patch, MagicMock
from db import init_db, get_connection, upsert_lead_multi_source
from normalize import resolve_country, assign_channel, normalize_lead
from sources import TokenBucketRateLimiter, OpenCorporatesClient, JobBoardClient
import time

class TestNormalization(unittest.TestCase):
    def test_resolve_country(self):
        self.assertEqual(resolve_country("US", "IN", "UK"), "US")
        self.assertEqual(resolve_country(None, "in", "uk"), "IN")
        self.assertEqual(resolve_country(None, None, "ca"), "CA")
        self.assertIsNone(resolve_country(None, None, None))
        
    def test_assign_channel(self):
        self.assertEqual(assign_channel("US"), "EMAIL_CAN_SPAM")
        self.assertEqual(assign_channel("IN"), "NURTURE")
        self.assertEqual(assign_channel(None), "REJECT")

    def test_normalize_lead(self):
        raw = {
            "company_name": "Test Co",
            "domain": "test.com",
            "contact_email": "hello@test.com",
            "registry_country": "US"
        }
        normalized = normalize_lead(raw, "OpenCorporates")
        self.assertEqual(normalized["country"], "US")
        self.assertEqual(normalized["channel"], "EMAIL_CAN_SPAM")
        self.assertEqual(normalized["source"], "OpenCorporates")
        self.assertEqual(normalized["domain"], "test.com")

class TestRateLimiter(unittest.TestCase):
    def test_token_bucket(self):
        limiter = TokenBucketRateLimiter(2, 10.0) # 2 capacity, 10 tokens/sec
        # First two should pass immediately
        start = time.time()
        limiter.wait()
        limiter.wait()
        self.assertTrue(time.time() - start < 0.1)
        # Third should wait ~0.1 sec
        limiter.wait()
        self.assertTrue(time.time() - start >= 0.1)

class TestDatabaseUpsert(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        
    def test_upsert_merge(self):
        conn = get_connection()
        lead1 = {
            "company_name": "Upsert Corp",
            "domain": "upsert.com",
            "source": "Source1",
            "country": "US",
            "channel": "EMAIL_CAN_SPAM"
        }
        upsert_lead_multi_source(conn, lead1)
        
        lead2 = {
            "domain": "upsert.com",
            "contact_email": "test@upsert.com",
            "source": "Source2",
            "country": "UK",
            "channel": "NURTURE"
        }
        upsert_lead_multi_source(conn, lead2)
        
        with conn.cursor() as cur:
            cur.execute("SELECT company_name, contact_email, sources FROM leads WHERE domain = 'upsert.com'")
            row = cur.fetchone()
            self.assertEqual(row[0], "Upsert Corp")
            self.assertEqual(row[1], "test@upsert.com")
            # Order of sources doesn't matter, but length should be 2
            self.assertEqual(len(row[2]), 2)
            self.assertIn("Source1", row[2])
            self.assertIn("Source2", row[2])
            
        conn.close()

if __name__ == "__main__":
    unittest.main()
