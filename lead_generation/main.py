"""
NFH Acquisition Pipeline v5.0 - FastAPI Control Plane

REST API endpoints for:
- Lead ingestion (batch)
- Webhook handling (opt-out)
- Health check
- Campaign status
"""

import os
import asyncio
import logging
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field
from dotenv import load_dotenv

load_dotenv()

from db import (
    init_db, upsert_lead, is_suppressed, add_to_suppression,
    get_lead_by_email, get_leads_for_email, store_generated_email,
    log_dead_letter
)
from dispatcher import send_email, dispatch_lead
from normalize import normalize_lead

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# ============ Pydantic Models ============

class LeadInput(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    company_name: Optional[str] = None
    domain: str
    contact_country_code: Optional[str] = None
    intent_signals: Dict[str, Any] = Field(default_factory=dict)
    tech_stack: Dict[str, Any] = Field(default_factory=dict)
    source: str = "api"
    source_id: Optional[str] = None


class LeadBatch(BaseModel):
    leads: List[LeadInput]


class OptoutRequest(BaseModel):
    email: EmailStr


class CampaignStatus(BaseModel):
    status: str
    count: int
    message: str


class HealthResponse(BaseModel):
    status: str
    version: str
    dispatch_mode: str


# ============ Lifespan ============

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    logger.info("Initializing database schema...")
    init_db()
    logger.info("NFH Acquisition Pipeline v5.0 ready")

    yield

    # Shutdown
    logger.info("Shutting down NFH Acquisition Pipeline...")


# ============ FastAPI App ============

app = FastAPI(
    title="NFH Acquisition Grid v5.0",
    description="Neural Forge Hub B2B Lead Acquisition System",
    version="5.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Background Task ============

async def process_lead(lead_data: Dict[str, Any]) -> None:
    """
    Process a single lead through the full pipeline:
    1. Check suppression
    2. Check eligibility (channel)
    3. Generate email
    4. Send email (based on dispatch mode)
    """
    try:
        email = lead_data.get("email")

        # 1. Check suppression
        if is_suppressed(email):
            logger.info(f"Lead {lead_data.get('id', 'unknown')} suppressed, skipping")
            return

        # 2. Check eligibility
        if lead_data.get("channel") != "EMAIL_CAN_SPAM":
            logger.info(f"Lead {lead_data.get('id', 'unknown')} channel={lead_data.get('channel')}, skipping")
            return

        # 3. Generate email (import here to avoid circular imports)
        from graph import generate_email_for_lead

        email_result = await generate_email_for_lead(lead_data)

        if email_result.get("status") != "success":
            logger.error(f"Email generation failed: {email_result.get('error')}")
            log_dead_letter(
                lead_data.get("id"),
                "email_generation",
                email_result.get("error", "Unknown error")
            )
            return

        # 4. Store generated email
        subject = email_result.get("email_draft", {}).get("subject", "Technical observation")
        body = email_result.get("final_payload", "")

        if lead_data.get("id"):
            store_generated_email(
                lead_id=lead_data["id"],
                subject=subject,
                body=body,
                sources_used=lead_data.get("sources", [])
            )

        # 5. Dispatch
        await dispatch_lead(lead_data, email_result)

    except Exception as e:
        logger.error(f"Error processing lead: {e}")
        log_dead_letter(
            lead_data.get("id"),
            "processing_error",
            str(e)
        )


# ============ API Endpoints ============

@app.get("/api/v1/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint."""
    return HealthResponse(
        status="operational",
        version="v5.0.0",
        dispatch_mode=os.getenv("DISPATCH_MODE", "dry_run")
    )


@app.post("/api/v1/campaigns/ingest", response_model=CampaignStatus)
async def ingest_leads(batch: LeadBatch, background_tasks: BackgroundTasks):
    """
    Ingest a batch of leads.

    Each lead is normalized and added to the database.
    Eligible leads (EMAIL_CAN_SPAM channel) are queued for email generation.
    """
    processed = 0
    queued = 0

    for lead_input in batch.leads:
        try:
            # Normalize the lead
            raw_data = {
                "email": lead_input.email,
                "first_name": lead_input.first_name,
                "last_name": lead_input.last_name,
                "company_name": lead_input.company_name,
                "domain": lead_input.domain,
                "contact_country_code": lead_input.contact_country_code,
                "intent_signals": lead_input.intent_signals,
                "tech_stack": lead_input.tech_stack,
                "source_id": lead_input.source_id
            }

            normalized = normalize_lead(raw_data, lead_input.source)

            # Check suppression before adding
            if is_suppressed(normalized["email"]):
                logger.info(f"Skipping suppressed email: {normalized['email']}")
                continue

            # Upsert to database
            lead_id = upsert_lead(normalized)
            processed += 1

            # Queue for email if eligible
            if normalized.get("channel") == "EMAIL_CAN_SPAM":
                lead_data = {
                    "id": lead_id,
                    **normalized
                }
                background_tasks.add_task(process_lead, lead_data)
                queued += 1

        except Exception as e:
            logger.error(f"Error ingesting lead {lead_input.email}: {e}")

    return CampaignStatus(
        status="queued" if queued > 0 else "processed",
        count=len(batch.leads),
        message=f"Processed {processed} leads, queued {queued} for email generation"
    )


@app.post("/api/v1/webhooks/optout", response_model=Dict[str, str])
async def handle_optout(request: OptoutRequest, background_tasks: BackgroundTasks):
    """
    Handle opt-out webhook from email provider.
    Adds the email to the global suppression list.
    """
    email = request.email.lower()

    # Add to suppression synchronously for immediate effect
    add_to_suppression(email, reason="optout_webhook")

    logger.info(f"Opt-out processed for {email}")

    return {"status": "suppressed", "email": email}


@app.post("/api/v1/webhooks/bounce", response_model=Dict[str, str])
async def handle_bounce(payload: Dict[str, Any]):
    """
    Handle bounce notification from email provider.
    Adds hard bounces to suppression list.
    """
    email = payload.get("email", "").lower()

    if email:
        add_to_suppression(email, reason=f"bounce: {payload.get('type', 'unknown')}")
        logger.info(f"Bounce processed for {email}")

    return {"status": "processed"}


@app.post("/api/v1/webhooks/reply", response_model=Dict[str, str])
async def handle_reply(payload: Dict[str, Any], background_tasks: BackgroundTasks):
    """
    Handle inbound reply from email provider.
    Records the reply and triggers triage.
    """
    email = payload.get("email", "").lower()
    body = payload.get("body", "")

    # Find the lead
    lead = get_lead_by_email(email)

    if lead:
        # Record the reply
        from db import record_inbound_reply
        record_inbound_reply(lead["id"], body)

        # Trigger triage (async)
        background_tasks.add_task(process_reply_triage, lead["id"], body)

        return {"status": "recorded", "lead_id": lead["id"]}

    return {"status": "ignored", "message": "Email not found in leads"}


async def process_reply_triage(lead_id: int, reply_body: str):
    """
    Classify the reply and take appropriate action.
    """
    try:
        from triage import classify_and_respond
        await classify_and_respond(lead_id, reply_body)
    except ImportError:
        logger.warning("Triage module not available, skipping reply classification")
    except Exception as e:
        logger.error(f"Error processing reply triage: {e}")


@app.get("/api/v1/leads", response_model=Dict[str, Any])
async def list_leads(
    channel: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """List leads with optional filtering."""
    # This would query the database
    # For now, return a placeholder
    return {
        "leads": [],
        "total": 0,
        "limit": limit,
        "offset": offset
    }


@app.get("/api/v1/stats")
async def get_stats():
    """Get pipeline statistics."""
    # This would aggregate from database
    return {
        "total_leads": 0,
        "email_can_spam": 0,
        "nurture": 0,
        "rejected": 0,
        "emails_generated": 0,
        "emails_sent": 0,
        "suppressed": 0,
        "dead_letters": 0
    }


# ============ Run Server ============

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    debug = os.getenv("DEBUG", "false").lower() == "true"

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=debug,
        log_level="info"
    )
