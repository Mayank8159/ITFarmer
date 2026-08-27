import os
import time
from datetime import timedelta
from prefect import flow, task, get_run_logger
from prefect.client.schemas.schedules import IntervalSchedule

from db import init_db, get_connection, upsert_lead_multi_source, get_leads_to_fingerprint, update_lead_tech_stack, log_dead_letter, update_lead_last_fetched, log_skipped_source
from apollo_client import ApolloClient
from fingerprinter import Fingerprinter
from sources import OpenCorporatesClient, GitHubClient, HackerNewsClient, JobBoardClient, RegistryClient, GooglePlacesClient
from normalize import normalize_lead

@task(retries=0)
def initialize_database():
    """Initialize the PostgreSQL database schema."""
    logger = get_run_logger()
    logger.info("Initializing database schema...")
    init_db()

@task(retries=3, retry_delay_seconds=60)
def source_leads(hiring_titles: list):
    """Source leads from Apollo based on hiring titles."""
    logger = get_run_logger()
    logger.info(f"Sourcing leads hiring for: {hiring_titles}")
    client = ApolloClient()
    leads = client.search_leads(hiring_titles)
    logger.info(f"Sourced {len(leads)} leads from Apollo.")
    return leads

@task(retries=0)
def fetch_from_all_sources(hiring_titles: list):
    """Fetch from all configured sources and normalize into DB."""
    logger = get_run_logger()
    conn = get_connection()
    
    clients = [
        OpenCorporatesClient(),
        GitHubClient(),
        HackerNewsClient(),
        JobBoardClient(),
        RegistryClient(),
        GooglePlacesClient()
    ]
    
    stats = {}
    
    try:
        for client in clients:
            if not client.is_configured:
                log_skipped_source(conn, client.source_name, "API key missing or not configured")
                stats[client.source_name] = {"new": 0, "merged": 0, "skipped": 1}
                logger.info(f"Skipped {client.source_name} due to missing config.")
                continue
                
            logger.info(f"Fetching from {client.source_name}...")
            # For demonstration, we just call fetch_leads. Some take query, some take hiring_titles.
            # We'll adapt based on client type for our mock implementation:
            raw_leads = client.fetch_leads(queries=hiring_titles) if hasattr(client, 'fetch_leads') else []
            
            stats[client.source_name] = {"new": len(raw_leads), "merged": 0, "skipped": 0}
            
            for raw in raw_leads:
                normalized = normalize_lead(raw, client.source_name)
                upsert_lead_multi_source(conn, normalized)
                
            logger.info(f"Finished {client.source_name}: {len(raw_leads)} leads processed.")
            
        for src, st in stats.items():
            logger.info(f"{src} Run Summary: {st['new']} new | {st['merged']} merged | {st['skipped']} skipped")
    finally:
        conn.close()

@flow(name="Weekly Multi-Source Ingestion")
def ingest_multi_source(hiring_titles: list):
    fetch_from_all_sources(hiring_titles)

@task(retries=0)
def fingerprint_leads():
    """
    Fetch leads without tech stack, and fingerprint them one by one.
    Respects rate limits (max 1 req/60s per domain, but we only hit each domain once).
    """
    logger = get_run_logger()
    conn = get_connection()
    fingerprinter = Fingerprinter()

    try:
        leads_to_process = get_leads_to_fingerprint(conn, limit=500)
        logger.info(f"Found {len(leads_to_process)} leads to fingerprint.")

        stats = {
            "fingerprinted": 0,
            "blocked": 0,
            "dead_letter": 0,
            "skipped": 0
        }

        for lead_id, domain, last_fetched_at in leads_to_process:
            logger.info(f"Fingerprinting domain: {domain}")
            
            status, tech_stack = fingerprinter.fingerprint_domain(domain, last_fetched_at=last_fetched_at)
            
            # Unconditionally update the fetch timestamp on success, error, or blocked
            update_lead_last_fetched(conn, domain)
            
            if status == "success" and tech_stack is not None:
                update_lead_tech_stack(conn, domain, tech_stack)
                logger.info(f"Successfully updated tech stack for {domain}")
                stats["fingerprinted"] += 1
            elif status == "blocked":
                logger.warning(f"Domain {domain} was blocked.")
                stats["blocked"] += 1
            elif status == "dead_letter":
                log_dead_letter(conn, domain, "Fingerprinting failed or timed out.")
                logger.warning(f"Logged {domain} to dead letter.")
                stats["dead_letter"] += 1
            elif status in ("skipped_cooldown", "skipped_robots"):
                stats["skipped"] += 1
            
            # Brief delay between different domains to be polite overall
            time.sleep(1)

        total_processed = sum(stats.values())
        if total_processed > 0:
            dead_letter_rate = stats["dead_letter"] / total_processed
            if dead_letter_rate > 0.30:
                logger.warning(f"High dead-letter rate: {dead_letter_rate:.1%} (>30% of batch)")
        
        logger.info(f"Run Summary: {stats['fingerprinted']} fingerprinted | {stats['blocked']} blocked | {stats['dead_letter']} dead-letter | {stats['skipped']} skipped")

    finally:
        conn.close()

@flow(name="Weekly Lead Generation Pipeline")
def lead_generation_flow(hiring_titles=["Backend Engineer", "ML Engineer"]):
    """
    The main flow orchestrating the lead generation data pipeline.
    """
    logger = get_run_logger()
    logger.info("Starting Lead Generation Pipeline...")

    # Step 1: Initialize Database
    initialize_database()

    # Step 2: Source Leads
    leads = source_leads(hiring_titles)

    # Step 3: Store Leads (Apollo specific)
    if leads:
        # Before we had a basic upsert, now we use the multi-source one and normalize
        from normalize import normalize_lead
        conn = get_connection()
        try:
            for lead in leads:
                normalized = normalize_lead({
                    "company_name": lead.get("company_name"),
                    "domain": lead.get("domain"),
                    "contact_name": lead.get("contact_name"),
                    "contact_email": lead.get("contact_email"),
                    "intent_signals": lead.get("intent_signals"),
                    "apollo_country": lead.get("country")
                }, "Apollo")
                upsert_lead_multi_source(conn, normalized)
            logger.info("Successfully stored Apollo leads.")
        finally:
            conn.close()

    # Step 4: Multi-Source Ingestion
    ingest_multi_source(hiring_titles)

    # Step 5: Fingerprint Tech Stack
    fingerprint_leads()

    logger.info("Lead Generation Pipeline completed.")

if __name__ == "__main__":
    # To run manually: python flow.py
    # To schedule:
    # lead_generation_flow.serve(name="weekly-lead-gen", schedule=IntervalSchedule(interval=timedelta(weeks=1)))
    lead_generation_flow()
