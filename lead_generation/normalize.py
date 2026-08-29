"""
NFH Lead Normalization and Geo-Routing

Geo-routing rules:
- US → EMAIL_CAN_SPAM (can send cold email)
- EU/UK/CA/AU → NURTURE (no cold email, nurture only)
- Other → REJECT (no contact)
"""

from typing import Dict, Any, Optional

# Restricted jurisdictions (GDPR, CASL, UK PECR compliance)
RESTRICTED_JURISDICTIONS = {
    # EU countries
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
    "SI", "ES", "SE",
    # EEA countries
    "IS", "LI", "NO",
    # UK
    "GB", "UK",
    # Canada
    "CA",
    # Australia
    "AU",
    # Switzerland
    "CH",
}


def resolve_country(
    registry_country: Optional[str] = None,
    job_country: Optional[str] = None,
    apollo_country: Optional[str] = None,
    contact_country_code: Optional[str] = None
) -> Optional[str]:
    """
    Resolve country based on priority:
    contact_country_code > registry > job posting > apollo > NULL.
    """
    if contact_country_code:
        return contact_country_code.upper()

    if registry_country:
        return registry_country.upper()

    if job_country:
        return job_country.upper()

    if apollo_country:
        return apollo_country.upper()

    return None


def route_channel(country_code: Optional[str]) -> str:
    """
    Assign channel based on resolved country code.

    - country = US → EMAIL_CAN_SPAM (can send cold email)
    - country in RESTRICTED_JURISDICTIONS → NURTURE (no cold email)
    - country unknown → REJECT (no contact)
    """
    if not country_code:
        return "REJECT"

    cc = country_code.upper()

    if cc == "US":
        return "EMAIL_CAN_SPAM"
    elif cc in RESTRICTED_JURISDICTIONS:
        return "NURTURE"

    return "REJECT"


def normalize_lead(raw_lead: Dict[str, Any], source: str) -> Dict[str, Any]:
    """
    Normalize raw data from any source into the standard LeadProfile shape.

    Expected input fields (from various sources):
    - company_name, domain, contact_name, contact_email
    - intent_signals, source_id
    - country fields: registry_country, job_country, apollo_country, contact_country_code
    """
    # Resolve country with priority
    country = resolve_country(
        registry_country=raw_lead.get("registry_country"),
        job_country=raw_lead.get("job_country"),
        apollo_country=raw_lead.get("apollo_country"),
        contact_country_code=raw_lead.get("contact_country_code")
    )

    # Assign channel based on geo-routing
    channel = route_channel(country)

    # Parse contact_name into first_name and last_name
    contact_name = raw_lead.get("contact_name", "")
    first_name, last_name = _parse_name(contact_name)

    # Handle both contact_email and email field names
    email = raw_lead.get("email") or raw_lead.get("contact_email")

    normalized = {
        "company_name": raw_lead.get("company_name"),
        "domain": raw_lead.get("domain"),
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "contact_country_code": country,
        "intent_signals": raw_lead.get("intent_signals", {}),
        "tech_stack": raw_lead.get("tech_stack", {}),
        "source": source,
        "source_id": raw_lead.get("source_id", ""),
        "sources": [source],
        "channel": channel,
    }

    return normalized


def _parse_name(full_name: str) -> tuple:
    """
    Parse a full name into first and last name.
    Handles common formats: "John Doe", "John M. Doe", "Doe, John"
    """
    if not full_name:
        return "", ""

    full_name = full_name.strip()

    # Handle "Last, First" format
    if "," in full_name:
        parts = full_name.split(",", 1)
        last_name = parts[0].strip()
        first_name = parts[1].strip() if len(parts) > 1 else ""
        return first_name, last_name

    # Handle "First Last" format
    parts = full_name.split()

    if len(parts) == 1:
        return parts[0], ""
    elif len(parts) == 2:
        return parts[0], parts[1]
    else:
        # "First Middle Last" or similar
        first_name = parts[0]
        last_name = parts[-1]
        return first_name, last_name


# Alias for backward compatibility
normalize_lead_profile = normalize_lead
