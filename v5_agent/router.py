from models import ContactProfile, PipelineRoute

# Full EEA + UK + CH + CASL + AU list
RESTRICTED_JURISDICTIONS = {
    # EU-27
    "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", 
    "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", 
    "SI", "ES", "SE",
    # EEA (non-EU)
    "IS", "LI", "NO",
    # UK
    "GB",
    # Switzerland (FADP)
    "CH",
    # Canada (CASL)
    "CA",
    # Australia (Spam Act)
    "AU"
}

def route_contact(contact: ContactProfile) -> PipelineRoute:
    """
    Routes based strictly on the individual contact's location.
    """
    cc = contact.contact_country_code.upper() if contact.contact_country_code else ""
    
    if cc == "US":
        return PipelineRoute.EMAIL_CAN_SPAM
    elif cc in RESTRICTED_JURISDICTIONS:
        return PipelineRoute.LINKEDIN_OFFICIAL
    else:
        # Missing data or unknown jurisdiction -> default to safest route (Reject cold email)
        return PipelineRoute.REJECT
