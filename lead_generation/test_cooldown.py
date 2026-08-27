import logging
from datetime import datetime, timedelta, timezone
from fingerprinter import Fingerprinter

logging.basicConfig(level=logging.INFO)

def run_cooldown_test():
    print("--- Testing Cooldown Boundary ---")
    f = Fingerprinter()
    
    # 1. Fetched 23h59m ago -> Should SKIP
    t_23h59m_ago = datetime.now(timezone.utc) - timedelta(hours=23, minutes=59)
    status_skip, _ = f.fingerprint_domain("example.com", last_fetched_at=t_23h59m_ago)
    print(f"23h59m ago: {status_skip}")
    assert status_skip == "skipped_cooldown", "Failed: should have skipped 23h59m"
    
    # 2. Fetched 24h01m ago -> Should NOT skip (assuming no other error, it should try to fetch or skip_robots)
    # But to prevent actually fetching example.com over and over, we can just check if status is NOT skipped_cooldown
    # We will use an invalid domain here just to see what happens, or use httpbin
    t_24h01m_ago = datetime.now(timezone.utc) - timedelta(hours=24, minutes=1)
    status_fetch, _ = f.fingerprint_domain("httpbin.org/status/403", last_fetched_at=t_24h01m_ago)
    print(f"24h01m ago: {status_fetch}")
    assert status_fetch != "skipped_cooldown", "Failed: should not have skipped 24h01m due to cooldown"

    print("Cooldown boundary test passed.")

if __name__ == "__main__":
    run_cooldown_test()
