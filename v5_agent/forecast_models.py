from pydantic import BaseModel, Field
from typing import Literal, Dict, Any

ModelTier = Literal["small (7B-9B)", "mid (13B-34B)", "large (70B+)", "frontier-api"]
InfraChoice = Literal["Vercel serverless", "AWS EC2", "GCP GKE", "On-prem", "Other"]

class ForecastRequest(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=80)
    work_email: str = Field(..., pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    expected_mau: int = Field(..., gt=0, le=10_000_000)
    requests_per_user_month: int = Field(..., gt=0, le=10_000)
    tokens_per_request: int = Field(..., gt=0, le=200_000)
    model_tier: ModelTier
    current_infrastructure: InfraChoice

# Transparent planning assumptions (labeled as estimates in every report)
MODEL_TIERS: Dict[str, Dict[str, Any]] = {
    "small (7B-9B)":  {"tok_s_per_gpu": 1800, "gpu": "A10G",  "gpu_hour_usd": 1.1},
    "mid (13B-34B)":  {"tok_s_per_gpu": 700,  "gpu": "A10G",  "gpu_hour_usd": 1.1},
    "large (70B+)":   {"tok_s_per_gpu": 350,  "gpu": "A100",  "gpu_hour_usd": 2.6},
    "frontier-api":   {"tok_s_per_gpu": None, "gpu": "managed", "gpu_hour_usd": None},
}

def compute_baseline(req: ForecastRequest) -> Dict[str, Any]:
    """Pure deterministic math. No LLM involved."""
    monthly_requests = req.expected_mau * req.requests_per_user_month
    total_tokens = monthly_requests * req.tokens_per_request
    tier = MODEL_TIERS[req.model_tier]

    if tier["gpu_hour_usd"] is None:
        # Frontier API: per-token pricing band ($0.30 - $3.00 per 1M tokens blended)
        cost_low = round(total_tokens / 1e6 * 0.30, 2)
        cost_high = round(total_tokens / 1e6 * 3.00, 2)
        gpu_hours = None
        gpu_type = "managed"
    else:
        # Self-hosted: tokens / (throughput * seconds * 50% utilization) * 1.2 redundancy
        gpu_hours = round(total_tokens / (tier["tok_s_per_gpu"] * 3600 * 0.5) * 1.2)
        cost_low = round(gpu_hours * tier["gpu_hour_usd"] * 0.8, 2)
        cost_high = round(gpu_hours * tier["gpu_hour_usd"] * 1.3, 2)
        gpu_type = tier["gpu"]

    return {
        "monthly_requests": monthly_requests,
        "total_tokens_month": total_tokens,
        "gpu_type": gpu_type,
        "est_gpu_hours_month": gpu_hours,
        "est_monthly_cost_low_usd": cost_low,
        "est_monthly_cost_high_usd": cost_high,
    }
