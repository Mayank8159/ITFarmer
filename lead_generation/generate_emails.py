import time
from prefect import flow, task, get_run_logger
from prefect.client.schemas.schedules import IntervalSchedule
from datetime import timedelta

from db import get_connection, get_leads_for_email, store_generated_email, log_dead_letter
from graph import generate_email_for_lead

@task(retries=0)
def generate_batch():
    logger = get_run_logger()
    conn = get_connection()
    
    # Run-summary counters
    stats = {
        "generated": 0,
        "skipped_non_us": 0,  # Just for keeping the schema, our query already filters this via 'EMAIL_CAN_SPAM'
        "skipped_no_tech": 0, # Our query already filters this
        "dead_letter": 0
    }
    
    try:
        leads = get_leads_for_email(conn, limit=30)
        logger.info(f"Found {len(leads)} eligible leads for email generation.")
        
        for lead_row in leads:
            lead_id, domain, tech_stack, intent_signals, sources = lead_row
            
            lead_data = {
                "id": lead_id,
                "domain": domain,
                "tech_stack": tech_stack,
                "intent_signals": intent_signals,
                "sources": sources
            }
            
            logger.info(f"Generating email for {domain} (Lead ID: {lead_id})")
            
            result = generate_email_for_lead(lead_data)
            
            if result["status"] == "success":
                store_generated_email(
                    conn,
                    lead_id=lead_id,
                    subject=result["final_subject"],
                    body=result["final_body"],
                    full_payload=result,
                    sources_used=sources
                )
                logger.info(f"Successfully generated and stored email for {domain}")
                stats["generated"] += 1
            else:
                log_dead_letter(conn, domain, f"Email generation failed: {result.get('error')}")
                logger.error(f"Failed to generate email for {domain}. Logged to dead_letter.")
                stats["dead_letter"] += 1
            
            # API Courtesy Delay
            time.sleep(1)
            
        logger.info(f"Run Summary: {stats['generated']} generated | {stats['skipped_non_us']} skipped (non-US) | {stats['skipped_no_tech']} skipped (no tech) | {stats['dead_letter']} dead-letter")
    finally:
        conn.close()

@flow(name="Weekly Outbound Generation")
def generate_outbound_emails():
    """
    Prefect flow that runs weekly, 24h after fingerprint flow.
    Reads eligible leads and uses LangGraph to generate emails.
    """
    logger = get_run_logger()
    logger.info("Starting Outbound Email Generation Pipeline...")
    generate_batch()
    logger.info("Outbound Email Generation Pipeline completed.")

if __name__ == "__main__":
    generate_outbound_emails()
