from typing import Dict, Any, Optional

def resolve_country(registry_country: Optional[str], job_country: Optional[str], apollo_country: Optional[str]) -> Optional[str]:
    """
    Resolve country based on priority:
    registry jurisdiction > job posting location > Apollo contact location > NULL.
    """
    if registry_country:
        return registry_country.upper()
    if job_country:
        return job_country.upper()
    if apollo_country:
        return apollo_country.upper()
    return None

def assign_channel(country: Optional[str]) -> str:
    """
    Assign channel based on country.
    - country = US -> EMAIL_CAN_SPAM
    - country known, non-US -> NURTURE
    - country unknown -> REJECT
    """
    if not country:
        return "REJECT"
    if country == "US":
        return "EMAIL_CAN_SPAM"
    return "NURTURE"

def normalize_lead(raw_data: Dict[str, Any], source: str) -> Dict[str, Any]:
    """
    Normalize raw data into the standard LeadProfile shape.
    Expected fields: company_name, domain, contact_name, contact_email, intent_signals, country.
    """
    # Assuming the raw_data dictionaries yielded from sources are already fairly close
    # or follow a specific convention. Since we mock them in tests, we will normalize them here.
    
    country = resolve_country(
        registry_country=raw_data.get("registry_country"),
        job_country=raw_data.get("job_country"),
        apollo_country=raw_data.get("apollo_country")
    )
    
    channel = assign_channel(country)
    
    normalized = {
        "company_name": raw_data.get("company_name"),
        "domain": raw_data.get("domain"),
        "contact_name": raw_data.get("contact_name"),
        "contact_email": raw_data.get("contact_email"),
        "intent_signals": raw_data.get("intent_signals", {}),
        "source": source,
        "source_id": raw_data.get("source_id", ""),
        "country": country,
        "channel": channel
    }
    
    return normalized
