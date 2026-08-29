"""
NFH Email Dispatcher

Supports:
- Resend (primary)
- Dry-run mode (logs to console)

Compliance:
- Plain-text only (no HTML, no tracking pixels, no images)
- Compliance footer appended by code in graph.py
"""

import os
import httpx
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


async def send_email_resend(lead: Dict[str, Any], draft: Dict[str, Any]) -> Dict[str, Any]:
    """
    Send email via Resend API.

    Args:
        lead: Lead data (email, first_name, company_name, domain)
        draft: Email draft (subject, final_payload)

    Returns:
        Dict with status and provider_email_id or error
    """
    api_key = os.getenv("RESEND_API_KEY")
    sender = os.getenv("SENDER_EMAIL", "engineering@nfh-systems.com")

    if not api_key:
        return {
            "status": "failed",
            "error": "RESEND_API_KEY not configured"
        }

    # Plain-text only email
    payload = {
        "from": f"Neural Forge Hub <{sender}>",
        "to": [lead["email"]],
        "subject": draft.get("subject", "Technical observation"),
        "text": draft.get("final_payload", draft.get("body", ""))
    }

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json=payload
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "status": "sent",
                    "provider_email_id": data.get("id")
                }
            else:
                logger.error(f"Resend API error: {response.status_code} - {response.text}")
                return {
                    "status": "failed",
                    "error": f"API error {response.status_code}: {response.text}"
                }
    except Exception as e:
        logger.error(f"Failed to send email: {e}")
        return {
            "status": "failed",
            "error": str(e)
        }


async def send_email_dry_run(lead: Dict[str, Any], draft: Dict[str, Any]) -> Dict[str, Any]:
    """
    Dry-run mode: logs the email that would be sent without actually sending.
    """
    logger.info(f"[DRY RUN] Would send to {lead['email']}:")
    logger.info(f"[DRY RUN] Subject: {draft.get('subject', 'N/A')}")
    logger.info(f"[DRY RUN] Body:\n{draft.get('final_payload', draft.get('body', 'N/A'))}")

    return {
        "status": "dry_run",
        "provider_email_id": None
    }


async def send_email(lead: Dict[str, Any], draft: Dict[str, Any]) -> Dict[str, Any]:
    """
    Main dispatch function. Routes to appropriate provider based on DISPATCH_MODE.

    Args:
        lead: Lead data
        draft: Generated email draft

    Returns:
        Dispatch result dict
    """
    dispatch_mode = os.getenv("DISPATCH_MODE", "dry_run")

    if dispatch_mode == "resend":
        return await send_email_resend(lead, draft)
    else:
        return await send_email_dry_run(lead, draft)


def record_dispatch(
    lead_id: int,
    subject: str,
    body: str,
    dispatch_result: Dict[str, Any],
    dispatch_mode: str
) -> None:
    """
    Record the dispatch attempt in the database.
    """
    from db import get_connection
    from psycopg2.extras import Json

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO generated_emails
                (lead_id, subject, body, dispatch_mode, provider_email_id, sent_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                lead_id,
                subject,
                body,
                dispatch_mode,
                dispatch_result.get("provider_email_id"),
                None if dispatch_result["status"] == "failed" else None
            ))

            # Update lead's last_email_sent_at on success
            if dispatch_result["status"] == "sent":
                cur.execute("""
                    UPDATE leads
                    SET last_email_sent_at = CURRENT_TIMESTAMP
                    WHERE id = %s
                """, (lead_id,))

            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Failed to record dispatch: {e}")
    finally:
        conn.close()


async def dispatch_lead(lead_data: Dict[str, Any], email_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Full dispatch pipeline for a single lead:
    1. Check suppression
    2. Check eligibility
    3. Generate email (if not already generated)
    4. Send email
    5. Record dispatch

    Args:
        lead_data: Full lead record from database
        email_result: Result from graph.py (email generation)

    Returns:
        Dispatch result
    """
    from db import is_suppressed

    # Check suppression
    email = lead_data.get("email") or lead_data.get("contact_email")
    if is_suppressed(email):
        logger.info(f"Lead {lead_data['id']} is suppressed, skipping")
        return {
            "status": "suppressed",
            "message": "Email in suppression list"
        }

    # Check eligibility
    channel = lead_data.get("channel")
    if channel != "EMAIL_CAN_SPAM":
        logger.info(f"Lead {lead_data['id']} channel is {channel}, not sending")
        return {
            "status": "skipped",
            "message": f"Channel {channel} not eligible for cold email"
        }

    # Check email was generated successfully
    if email_result.get("status") != "success":
        logger.error(f"Email generation failed for lead {lead_data['id']}")
        return {
            "status": "failed",
            "message": f"Email generation failed: {email_result.get('error')}"
        }

    # Prepare dispatch data
    dispatch_data = {
        "id": lead_data["id"],
        "email": email,
        "first_name": lead_data.get("first_name", ""),
        "company_name": lead_data.get("company_name", ""),
        "domain": lead_data.get("domain", "")
    }

    draft_data = {
        "subject": email_result.get("email_draft", {}).get("subject", "Technical observation"),
        "final_payload": email_result.get("final_payload", "")
    }

    # Send email
    dispatch_result = await send_email(dispatch_data, draft_data)

    # Record dispatch
    dispatch_mode = os.getenv("DISPATCH_MODE", "dry_run")
    record_dispatch(
        lead_id=lead_data["id"],
        subject=draft_data["subject"],
        body=draft_data["final_payload"],
        dispatch_result=dispatch_result,
        dispatch_mode=dispatch_mode
    )

    logger.info(f"Dispatch result for lead {lead_data['id']}: {dispatch_result['status']}")
    return dispatch_result


if __name__ == "__main__":
    # Test dry run
    import asyncio

    logging.basicConfig(level=logging.INFO)

    test_lead = {
        "id": 1,
        "email": "test@example.com",
        "first_name": "John",
        "company_name": "Test Corp",
        "domain": "example.com",
        "channel": "EMAIL_CAN_SPAM"
    }

    test_draft = {
        "subject": "latency on example.com",
        "final_payload": "Our automated observer flagged...\n\n---\nNeural Forge Hub, 251 Little Falls Drive, Wilmington, DE 19808\nTo stop: https://nfh-systems.com/optout"
    }

    result = asyncio.run(send_email(test_lead, test_draft))
    print(f"Result: {result}")
