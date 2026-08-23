import os
import httpx
from typing import Dict
from models import ContactProfile

SMARTLEAD_API_KEY = os.getenv("SMARTLEAD_API_KEY")
SMARTLEAD_API_URL = "https://server.smartlead.ai/api/v1"

async def push_to_smartlead(contact: ContactProfile, campaign_id: str, email_subject: str, email_body: str) -> Dict:
    if not SMARTLEAD_API_KEY:
        raise ValueError("SMARTLEAD_API_KEY is not set.")
    
    endpoint = f"{SMARTLEAD_API_URL}/campaigns/{campaign_id}/leads"
    
    payload = {
        "lead_list": [
            {
                "first_name": contact.first_name,
                "last_name": contact.last_name,
                "email": contact.email,
                "company_name": contact.company_name,
                "website": contact.company_domain,
                "custom_fields": {
                    "v5_generated_subject": email_subject,
                    "v5_generated_body": email_body,
                    "v5_routing_status": "APPROVED",
                    "v5_tech_stack": ", ".join(contact.tech_stack)
                }
            }
        ]
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{endpoint}?api_key={SMARTLEAD_API_KEY}", json=payload, headers=headers)
        
        if response.status_code in [200, 201]:
            print(f"[SUCCESS] Lead {contact.email} injected into Campaign {campaign_id}.")
            return response.json()
        else:
            print(f"[ERROR] Smartlead API rejected payload: {response.status_code}")
            print(response.text)
            return {"error": response.text}
