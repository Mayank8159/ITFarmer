import urllib.parse
from typing import List

CAL_BASE_URL = "https://cal.com/neuralforge/architecture-sync"

def generate_personalized_booking_link(
    first_name: str, 
    last_name: str, 
    email: str, 
    tech_stack: List[str]
) -> str:
    """
    Generates a personalized Cal.com booking link with pre-filled fields.
    This reduces friction for the prospect when scheduling the sync.
    """
    tech_stack_str = ", ".join(tech_stack) if tech_stack else "Not specified"
    
    params = {
        "name": f"{first_name} {last_name}".strip(),
        "email": email,
        "tech_stack": tech_stack_str 
    }
    
    query_string = urllib.parse.urlencode(params)
    personalized_url = f"{CAL_BASE_URL}?{query_string}"
    
    return personalized_url
