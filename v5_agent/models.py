from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum

class PipelineRoute(str, Enum):
    EMAIL_CAN_SPAM = "EMAIL_CAN_SPAM"
    LINKEDIN_OFFICIAL = "LINKEDIN_OFFICIAL" # Human-sent or official API only
    REJECT = "REJECT"

class ContactProfile(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    contact_country_code: str = Field(..., description="ISO 3166-1 alpha-2 of the CONTACT's location")
    company_name: str
    company_domain: str
    tech_stack: List[str] = []
    hiring_intent_signals: List[str] = []
    route: Optional[PipelineRoute] = None

class TraceResult(BaseModel):
    domain: str
    # Channel 1: Browser
    browser_success: bool = False
    ttfb_ms: Optional[int] = None
    dom_content_loaded_ms: Optional[int] = None
    has_hsts: bool = False
    has_csp: bool = False
    waf_blocked: bool = False
    # Channel 2: Public Records
    dns_a_records: List[str] = []
    mx_records: List[str] = []
    ct_log_issuer: Optional[str] = None
