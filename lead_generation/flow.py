"""
NFH Acquisition Pipeline v5.0 - Prefect Flows

Main flows:
1. lead_ingestion_flow - Source and ingest leads from all sources
2. fingerprint_flow - Fingerprint tech stack for leads
3. email_generation_flow - Generate and send emails
4. full_pipeline - Orchestrates all flows

All LLM calls use OmniRoute (Groq) via LangChain.
"""

import os
import time
from datetime import timedelta
from prefect import flow, task, get_run_logger
from prefect.client.schemas.schedules import IntervalSchedule

from db import (
    init_db, get_connection, upsert_lead, get_leads_to_fingerprint,
    update_lead_tech_stack, log_dead_letter, update_lead_last_fetched,
    log_skipped_source, get_leads_for_email, store_generated_email, return_connection
)
from apollo_client import ApolloClient
from fingerprinter import Fingerprinter
from sources import (
    OpenCorporatesClient, GitHubClient, HackerNewsClient,
    JobBoardClient, RegistryClient, GooglePlacesClient
)
from normalize import normalize_lead


@task(name="Initialize Database")
def initialize_database():
    """Initialize the PostgreSQL database schema."""
    logger = get_run_logger()
    logger.info("Initializing database schema...")
    init_db()
    logger.info("Database schema ready")


@task(name="Fetch Apollo Leads", retries=3, retry_delay_seconds=60)
def fetch_apollo_leads(hiring_titles: list) -> list:
    """Source leads from Apollo based on hiring titles."""
    logger = get_run_logger()
    logger.info(f"Fetching leads from Apollo for: {hiring_titles}")

    try:
        client = ApolloClient()
        leads = client.search_leads(hiring_titles)
        logger.info(f"Fetched {len(leads)} leads from Apollo")
        return leads
    except Exception as e:
        logger.error(f"Apollo fetch failed: {e}")
        raise


@task(name="Fetch From All Sources")
def fetch_from_all_sources(hiring_titles: list) -> dict:
    """Fetch from all configured sources and normalize into DB."""
    logger = get_run_logger()
    conn = get_connection()

    clients = [
        ("OpenCorporates", OpenCorporatesClient()),
        ("GitHub", GitHubClient()),
        ("HackerNews", HackerNewsClient()),
        ("JobBoards", JobBoardClient()),
        ("Registries", RegistryClient()),
        ("GooglePlaces", GooglePlacesClient())
    ]

    stats = {}
    total_processed = 0

    try:
        for source_name, client in clients:
            if not client.is_configured:
                log_skipped_source(source_name, "API key missing or not configured")
                stats[source_name] = {"new": 0, "merged": 0, "skipped": 1}
                logger.info(f"Skipped {source_name}: not configured")
                continue

            logger.info(f"Fetching from {source_name}...")

            try:
                raw_leads = client.fetch_leads(queries=hiring_titles) if hasattr(client, 'fetch_leads') else []

                for raw in raw_leads:
                    normalized = normalize_lead(raw, source_name)
                    if normalized.get("email"):  # Only insert if we have an email
                        upsert_lead(normalized)
                        total_processed += 1

                stats[source_name] = {
                    "new": len(raw_leads),
                    "merged": 0,
                    "skipped": 0
                }
                logger.info(f"Finished {source_name}: {len(raw_leads)} leads")

            except Exception as e:
                logger.error(f"Error fetching from {source_name}: {e}")
                stats[source_name] = {"error": str(e)}
                log_skipped_source(source_name, str(e))

        for src, st in stats.items():
            if "error" not in st:
                logger.info(f"{src}: {st['new']} new | {st['merged']} merged | {st['skipped']} skipped")

        logger.info(f"Total leads processed: {total_processed}")

    finally:
        return_connection(conn)

    return stats


@task(name="Fingerprint Tech Stacks")
def fingerprint_leads_task(limit: int = 500) -> dict:
    """
    Fingerprint tech stacks for leads without them.
    Respects robots.txt and 24h cooldown.
    """
    logger = get_run_logger()
    conn = get_connection()
    fingerprinter = Fingerprinter()

    stats = {
        "fingerprinted": 0,
        "blocked": 0,
        "dead_letter": 0,
        "skipped_cooldown": 0,
        "skipped_robots": 0
    }

    try:
        leads = get_leads_to_fingerprint(limit=limit)
        logger.info(f"Found {len(leads)} leads to fingerprint")

        for lead_id, domain, last_fetched, existing_stack in leads:
            if existing_stack is not None:
                stats["skipped_cooldown"] += 1
                continue

            logger.info(f"Fingerprinting: {domain}")

            status, tech_stack = fingerprinter.fingerprint_domain(domain, last_fetched_at=last_fetched)

            # Always update last_fetched timestamp
            update_lead_last_fetched(domain)

            if status == "success" and tech_stack:
                update_lead_tech_stack(domain, tech_stack)
                logger.info(f"Fingerprinted {domain}: {list(tech_stack.keys())}")
                stats["fingerprinted"] += 1
            elif status == "blocked":
                logger.warning(f"Blocked: {domain}")
                stats["blocked"] += 1
            elif status == "dead_letter":
                log_dead_letter(lead_id, "fingerprint_failed", f"Status: {status}")
                stats["dead_letter"] += 1
            elif status == "skipped_cooldown":
                stats["skipped_cooldown"] += 1
            elif status == "skipped_robots":
                stats["skipped_robots"] += 1
                logger.info(f"Skipped {domain}: disallowed by robots.txt")

            # Polite delay between domains
            time.sleep(1)

        # Check for high dead-letter rate
        total = sum(stats.values())
        if total > 0:
            dl_rate = stats["dead_letter"] / total
            if dl_rate > 0.30:
                logger.warning(f"High dead-letter rate: {dl_rate:.1%}")

        logger.info(f"Fingerprint summary: {stats}")

    finally:
        return_connection(conn)

    return stats


@task(name="Generate Emails", retries=2, retry_delay_seconds=120)
def generate_emails_task(limit: int = 30) -> dict:
    """Generate emails for eligible leads using LangGraph."""
    logger = get_run_logger()
    conn = get_connection()

    # Import here to avoid circular imports
    from graph import generate_email_for_lead
    from dispatcher import send_email, record_dispatch

    stats = {
        "generated": 0,
        "sent": 0,
        "failed": 0,
        "skipped_suppressed": 0,
        "skipped_channel": 0
    }

    dispatch_mode = os.getenv("DISPATCH_MODE", "dry_run")

    try:
        leads = get_leads_for_email(limit=limit)
        logger.info(f"Found {len(leads)} eligible leads for email generation")

        for lead in leads:
            logger.info(f"Processing: {lead['domain']}")

            try:
                # Generate email via LangGraph
                result = await generate_email_for_lead(lead)

                if result.get("status") != "success":
                    logger.error(f"Generation failed: {result.get('error')}")
                    log_dead_letter(lead["id"], "generation_failed", result.get("error", ""))
                    stats["failed"] += 1
                    continue

                # Store generated email
                subject = result.get("email_draft", {}).get("subject", "Technical observation")
                body = result.get("final_payload", "")

                store_generated_email(
                    lead_id=lead["id"],
                    subject=subject,
                    body=body,
                    sources_used=lead.get("sources", [])
                )

                stats["generated"] += 1

                # Send email
                dispatch_result = await send_email(lead, {
                    "subject": subject,
                    "final_payload": body
                })

                record_dispatch(
                    lead_id=lead["id"],
                    subject=subject,
                    body=body,
                    dispatch_result=dispatch_result,
                    dispatch_mode=dispatch_mode
                )

                if dispatch_result["status"] == "sent":
                    stats["sent"] += 1

                logger.info(f"Dispatch result: {dispatch_result['status']}")

            except Exception as e:
                logger.error(f"Error processing lead {lead['id']}: {e}")
                log_dead_letter(lead["id"], "processing_error", str(e))
                stats["failed"] += 1

            # API courtesy delay
            time.sleep(2)

        logger.info(f"Email generation summary: {stats}")

    finally:
        return_connection(conn)

    return stats


# Make generate_emails_task properly async
generate_emails_task.fn = generate_emails_task._fn  # Preserve original


@flow(name="Multi-Source Lead Ingestion")
def ingest_multi_source(hiring_titles: list = None):
    """
    Ingest leads from Apollo and other sources.
    """
    logger = get_run_logger()

    if hiring_titles is None:
        hiring_titles = ["Backend Engineer", "ML Engineer", "Senior Developer"]

    # Initialize DB
    initialize_database()

    # Fetch from Apollo
    apollo_leads = fetch_apollo_leads(hiring_titles)

    # Store Apollo leads
    if apollo_leads:
        conn = get_connection()
        try:
            for lead in apollo_leads:
                normalized = normalize_lead({
                    "company_name": lead.get("company_name"),
                    "domain": lead.get("domain"),
                    "contact_name": lead.get("contact_name"),
                    "contact_email": lead.get("contact_email"),
                    "intent_signals": lead.get("intent_signals"),
                    "apollo_country": lead.get("country")
                }, "Apollo")
                upsert_lead(normalized)
            logger.info(f"Stored {len(apollo_leads)} Apollo leads")
        finally:
            return_connection(conn)

    # Fetch from other sources
    fetch_from_all_sources(hiring_titles)

    return {"status": "completed"}


@flow(name="Tech Stack Fingerprinting")
def fingerprint_flow(limit: int = 500):
    """
    Fingerprint tech stacks for all leads that need it.
    """
    logger = get_run_logger()
    logger.info("Starting fingerprint flow...")

    initialize_database()
    stats = fingerprint_leads_task(limit=limit)

    logger.info("Fingerprint flow completed")
    return stats


@flow(name="Email Generation & Dispatch")
def email_generation_flow(limit: int = 30):
    """
    Generate and optionally send emails for eligible leads.
    """
    logger = get_run_logger()
    logger.info("Starting email generation flow...")

    initialize_database()
    stats = generate_emails_task(limit=limit)

    logger.info("Email generation flow completed")
    return stats


@flow(name="Weekly Lead Generation Pipeline")
def full_pipeline(
    hiring_titles: list = None,
    fingerprint_limit: int = 500,
    email_limit: int = 30
):
    """
    The complete weekly lead generation pipeline.

    Steps:
    1. Initialize database
    2. Ingest leads from all sources
    3. Fingerprint tech stacks
    4. Generate and send emails

    Schedule: Weekly (every 7 days)
    """
    logger = get_run_logger()
    logger.info("Starting full NFH pipeline...")

    # 1. Initialize
    initialize_database()

    # 2. Ingest
    logger.info("Phase 1: Lead Ingestion")
    ingest_result = ingest_multi_source(hiring_titles)

    # 3. Fingerprint
    logger.info("Phase 2: Tech Stack Fingerprinting")
    fingerprint_stats = fingerprint_leads_task(limit=fingerprint_limit)

    # 4. Generate & Send
    logger.info("Phase 3: Email Generation")
    email_stats = generate_emails_task(limit=email_limit)

    logger.info("Full pipeline completed")
    return {
        "ingest": ingest_result,
        "fingerprint": fingerprint_stats,
        "email": email_stats
    }


# ============ Scheduled Flows ============

# Schedule for weekly pipeline (for Prefect Orion server)
weekly_schedule = IntervalSchedule(
    interval=timedelta(weeks=1),
    start_date=datetime.now()
)


if __name__ == "__main__":
    import argparse
    from datetime import datetime

    parser = argparse.ArgumentParser(description="NFH Lead Generation Flows")
    parser.add_argument("--flow", choices=["ingest", "fingerprint", "email", "full"],
                        default="full", help="Which flow to run")
    parser.add_argument("--hiring-titles", nargs="+",
                        default=["Backend Engineer", "ML Engineer"],
                        help="Hiring titles to search for")
    parser.add_argument("--limit", type=int, default=30,
                        help="Batch limit for email generation")

    args = parser.parse_args()

    if args.flow == "ingest":
        ingest_multi_source(args.hiring_titles)
    elif args.flow == "fingerprint":
        fingerprint_flow()
    elif args.flow == "email":
        email_generation_flow(args.limit)
    elif args.flow == "full":
        full_pipeline(args.hiring_titles)

    print("Flow completed successfully!")
