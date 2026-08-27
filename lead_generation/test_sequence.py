import logging
import os
from datetime import datetime, timezone
from db import init_db, get_connection, upsert_lead, get_leads_to_fingerprint
from flow import fingerprint_leads

logging.basicConfig(level=logging.INFO)

def insert_test_lead(domain):
    conn = get_connection()
    try:
        upsert_lead(conn, {
            "company_name": f"Test {domain}",
            "domain": domain,
            "contact_name": "Test User",
            "contact_email": f"test@{domain}",
            "intent_signals": {}
        })
        # Reset last_fetched_at if it exists
        with conn.cursor() as cur:
            cur.execute("UPDATE leads SET last_fetched_at = NULL, tech_stack = NULL WHERE domain = %s", (domain,))
        conn.commit()
    finally:
        conn.close()

def run_test():
    print("--- Initialize DB ---")
    init_db()
    
    print("\n--- Test 1: Insert example.com ---")
    insert_test_lead("example.com")
    fingerprint_leads()
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT tech_stack, last_fetched_at FROM leads WHERE domain = 'example.com'")
        tech_stack, last_fetched_at = cur.fetchone()
        print(f"Result for example.com: tech_stack populated? {bool(tech_stack)}, last_fetched_at populated? {bool(last_fetched_at)}")
    conn.close()
    
    print("\n--- Test 2: Insert Cloudflare-protected domain (e.g. cloudflare.com) ---")
    insert_test_lead("httpbin.org/status/403")
    # Using httpbin.org/status/403 to deterministically trigger a 403 block.
    fingerprint_leads()
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT tech_stack, last_fetched_at FROM leads WHERE domain = 'httpbin.org/status/403'")
        tech_stack, last_fetched_at = cur.fetchone()
        print(f"Result for httpbin.org/status/403: tech_stack populated? {bool(tech_stack)}, last_fetched_at populated? {bool(last_fetched_at)}")
    conn.close()
    
    print("\n--- Test 3: Insert an unresolvable domain (e.g. thisdomaindoesnotexist12345.com) ---")
    insert_test_lead("thisdomaindoesnotexist12345.com")
    fingerprint_leads()
    conn = get_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT tech_stack, last_fetched_at FROM leads WHERE domain = 'thisdomaindoesnotexist12345.com'")
        tech_stack, last_fetched_at = cur.fetchone()
        cur.execute("SELECT * FROM dead_letter WHERE domain = 'thisdomaindoesnotexist12345.com'")
        dl_entry = cur.fetchone()
        print(f"Result for unresolvable: tech_stack populated? {bool(tech_stack)}, last_fetched_at populated? {bool(last_fetched_at)}, in dead_letter? {bool(dl_entry)}")
    conn.close()

    print("\n--- Test 4: Re-run flow immediately ---")
    # All 3 domains should have last_fetched_at set and be skipped.
    fingerprint_leads()
    # It should print "Found 0 leads to fingerprint."
    print("Test 4 complete.")

if __name__ == "__main__":
    run_test()
