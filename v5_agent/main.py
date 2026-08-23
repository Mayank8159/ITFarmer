from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()
from pydantic import BaseModel
from typing import List
import asyncio
import redis.asyncio as redis
import os

from models import ContactProfile
from graph import run_pipeline
from triage import classify_reply, ReplySentiment
from cal_com import generate_personalized_booking_link
from forecast_api import router as forecast_router

app = FastAPI(
    title="Neural Forge Hub - Autonomous Acquisition Grid",
    version="5.0",
    description="Signal-based outbound infrastructure."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://www.neuralforgehub.tech", "http://localhost:3000"],
    allow_methods=["POST"],
    allow_headers=["*"],
)

app.include_router(forecast_router)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
if os.getenv("USE_FAKE_REDIS") == "1":
    import fakeredis.aioredis
    redis_client = fakeredis.aioredis.FakeRedis(decode_responses=True)
else:
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)

class LeadBatch(BaseModel):
    leads: List[dict]

async def process_lead_background(lead_data: dict):
    try:
        domain = lead_data.get("company_domain")
        email = lead_data.get("email")
        
        if await redis_client.sismember("global_suppression", email):
            print(f"[SUPPRESSED] {email} is on the global opt-out list. Skipping.")
            return

        rate_key = f"rate_limit:{domain}"
        if await redis_client.exists(rate_key):
            print(f"[RATE LIMIT] Skipping {domain}, traced within the last 60s.")
            return
            
        await redis_client.setex(rate_key, 60, "1")
        result = await run_pipeline(lead_data)
        
        if result.get("final_email_payload"):
            print(f"[DEPLOY] Email generated for {lead_data['first_name']}. Pushing to Smartlead...")
            
    except Exception as e:
        print(f"[ERROR] Pipeline failed for {lead_data.get('email')}: {str(e)}")

async def process_inbound_reply_background(payload: dict):
    lead_email = payload.get("lead", {}).get("email")
    lead_first_name = payload.get("lead", {}).get("first_name", "")
    lead_last_name = payload.get("lead", {}).get("last_name", "")
    email_body = payload.get("email_body", "")
    
    print(f"[TRIAGE] Analyzing reply from {lead_email}...")
    
    classification = await classify_reply(email_body)
    print(f"[TRIAGE] Result for {lead_email}: {classification.sentiment.value} - {classification.reasoning}")
    
    if classification.sentiment == ReplySentiment.NEGATIVE_OPTOUT:
        await redis_client.sadd("global_suppression", lead_email)
        print(f"[SUPPRESSED] Added {lead_email} to global suppression list.")
        
    elif classification.sentiment == ReplySentiment.POSITIVE_MEETING_READY:
        tech_stack = ["Next.js", "AWS"]
        booking_link = generate_personalized_booking_link(
            first_name=lead_first_name,
            last_name=lead_last_name,
            email=lead_email,
            tech_stack=tech_stack
        )
        print(f"[CONVERSION] Generated booking link for {lead_email}: {booking_link}")

@app.post("/api/v1/campaigns/ingest")
async def ingest_leads(batch: LeadBatch, background_tasks: BackgroundTasks):
    for lead_data in batch.leads:
        background_tasks.add_task(process_lead_background, lead_data)
    return {"status": "queued", "count": len(batch.leads)}

@app.post("/api/v1/webhooks/smartlead")
async def smartlead_webhook(payload: dict, background_tasks: BackgroundTasks):
    event_type = payload.get("event")
    lead_email = payload.get("lead", {}).get("email")
    
    if not lead_email:
        raise HTTPException(status_code=400, detail="Missing lead email in payload")

    if event_type in ["opt_out", "bounce", "hard_bounce"]:
        await redis_client.sadd("global_suppression", lead_email)
        return {"status": "suppressed", "email": lead_email}
        
    elif event_type == "reply":
        print(f"[INBOUND] Reply received from {lead_email}. Routing to Classifier...")
        background_tasks.add_task(process_inbound_reply_background, payload)
        return {"status": "queued_for_classification"}
        
    return {"status": "ignored"}

@app.get("/api/v1/health")
async def health_check():
    redis_ping = await redis_client.ping()
    return {
        "status": "operational", 
        "version": "v5",
        "redis_connected": redis_ping
    }
