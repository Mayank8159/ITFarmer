import os, base64
from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
import httpx
import redis.asyncio as redis
from forecast_models import ForecastRequest
from forecast_graph import run_forecast
from forecast_pdf import build_pdf

router = APIRouter(prefix="/api/v1/forecast", tags=["forecast"])

if os.getenv("USE_FAKE_REDIS") == "1":
    import fakeredis.aioredis
    rl_client = fakeredis.aioredis.FakeRedis(decode_responses=True)
else:
    rl_client = redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True)

async def _deliver_email(req: ForecastRequest, pdf_bytes: bytes):
    key = os.getenv("RESEND_API_KEY")
    if not key:
        print("[FORECAST] No RESEND_API_KEY - PDF generated but not emailed.")
        return
    payload = {
        "from": os.getenv("SENDER_EMAIL", "engineering@nfh-engineering.com"),
        "to": [req.work_email],
        "subject": f"{req.company_name} - AI Infrastructure Blueprint",
        "text": "Your AI Infrastructure Blueprint is attached. Book your architecture review: https://cal.com/neural-forge-hub",
        "attachments": [{
            "filename": f"{req.company_name.replace(' ', '_')}_Blueprint.pdf",
            "content": base64.b64encode(pdf_bytes).decode()
        }]
    }
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {key}"},
            json=payload
        )
        print(f"[FORECAST] Email dispatch status: {r.status_code}")

@router.post("/generate")
async def generate(req: ForecastRequest, request: Request, bg: BackgroundTasks):
    ip = request.client.host if request.client else "unknown"
    rl_key = f"forecast_rl:{ip}"
    count = await rl_client.incr(rl_key)
    if count == 1:
        await rl_client.expire(rl_key, 3600)
    if count > 3:
        raise HTTPException(status_code=429, detail="Rate limit: 3 blueprints per hour.")

    state = await run_forecast(req)
    pdf_bytes = build_pdf(req.company_name, state["baseline"], state["cost_analysis"], state["recommendation"])
    bg.add_task(_deliver_email, req, pdf_bytes)

    return {
        "baseline": state["baseline"],
        "cost_analysis": state["cost_analysis"],
        "recommendation": state["recommendation"],
        "report_markdown": state["report_markdown"],
        "delivered_to": req.work_email,
    }
