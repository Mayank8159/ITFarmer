"""
NFH Email Generation Script

Standalone script to generate and optionally send emails for eligible leads.
"""

import os
import time
import asyncio
import logging
from dotenv import load_dotenv

load_dotenv()

from db import (
    init_db, get_connection, get_leads_for_email,
    store_generated_email, log_dead_letter, return_connection
)
from graph import generate_email_for_lead
from dispatcher import send_email, record_dispatch

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


async def process_lead(lead: dict) -> dict:
    """
    Generate and optionally send email for a single lead.

    Args:
        lead: Lead data from database

    Returns:
        Result dict with status and details
    """
    logger.info(f"Processing lead: {lead.get('domain', 'unknown')} ({lead['id']})")

    # Generate email using LangGraph
    try:
        result = await generate_email_for_lead(lead)

        if result.get("status") != "success":
            logger.error(f"Email generation failed: {result.get('error')}")
            log_dead_letter(lead["id"], "generation_failed", result.get("error", "Unknown"))
            return {
                "lead_id": lead["id"],
                "domain": lead.get("domain"),
                "status": "failed",
                "error": result.get("error")
            }

        # Extract draft data
        subject = result.get("email_draft", {}).get("subject", "Technical observation")
        final_payload = result.get("final_payload", "")

        # Store generated email
        store_generated_email(
            lead_id=lead["id"],
            subject=subject,
            body=final_payload,
            sources_used=lead.get("sources", [])
        )

        logger.info(f"Email generated for {lead['domain']}")

        # Optionally send email
        dispatch_mode = os.getenv("DISPATCH_MODE", "dry_run")
        if dispatch_mode != "skip":
            dispatch_result = await send_email(lead, {
                "subject": subject,
                "final_payload": final_payload
            })

            record_dispatch(
                lead_id=lead["id"],
                subject=subject,
                body=final_payload,
                dispatch_result=dispatch_result,
                dispatch_mode=dispatch_mode
            )

            logger.info(f"Dispatch result: {dispatch_result['status']}")
        else:
            logger.info("Email generation only (dispatch skipped)")

        return {
            "lead_id": lead["id"],
            "domain": lead.get("domain"),
            "status": "success",
            "subject": subject
        }

    except Exception as e:
        logger.error(f"Error processing lead {lead['id']}: {e}")
        log_dead_letter(lead["id"], "processing_error", str(e))
        return {
            "lead_id": lead["id"],
            "domain": lead.get("domain"),
            "status": "failed",
            "error": str(e)
        }


async def run_batch(limit: int = 30, batch_delay: float = 2.0) -> dict:
    """
    Process a batch of eligible leads.

    Args:
        limit: Maximum leads to process
        batch_delay: Delay between leads in seconds

    Returns:
        Summary stats
    """
    logger.info(f"Starting email generation batch (limit={limit})")

    # Get eligible leads
    leads = get_leads_for_email(limit=limit)
    logger.info(f"Found {len(leads)} eligible leads")

    if not leads:
        logger.info("No eligible leads found")
        return {"processed": 0, "success": 0, "failed": 0}

    # Process leads
    stats = {"processed": 0, "success": 0, "failed": 0}

    for lead in leads:
        result = await process_lead(lead)
        stats["processed"] += 1

        if result["status"] == "success":
            stats["success"] += 1
        else:
            stats["failed"] += 1

        # Rate limiting delay
        if lead != leads[-1]:
            await asyncio.sleep(batch_delay)

    logger.info(f"Batch complete: {stats}")
    return stats


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="Generate emails for eligible leads")
    parser.add_argument("--limit", type=int, default=30, help="Max leads to process")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay between leads (seconds)")
    parser.add_argument("--init-db", action="store_true", help="Initialize database first")

    args = parser.parse_args()

    # Initialize database if requested
    if args.init_db:
        logger.info("Initializing database...")
        init_db()

    # Run the batch
    asyncio.run(run_batch(limit=args.limit, batch_delay=args.delay))


if __name__ == "__main__":
    main()
