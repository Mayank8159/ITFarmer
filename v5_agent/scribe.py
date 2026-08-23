from pydantic import BaseModel

NFH_PHYSICAL_ADDRESS = "Neural Forge Hub, 251 Little Falls Drive, Wilmington, DE 19808"
NFH_OPTOUT_URL = "https://nfh-engineering.com/optout"

class EmailDraft(BaseModel):
    subject: str
    body: str

def append_compliance_footer(draft: EmailDraft) -> str:
    """
    Appends the hardcoded CAN-SPAM footer AFTER the LLM generates the body.
    Ensures exactly one opt-out mechanism exists in the final payload.
    """
    footer = f"""
---
{NFH_PHYSICAL_ADDRESS}
To stop receiving automated technical traces from our systems, click here: {NFH_OPTOUT_URL}
"""
    return draft.body + footer
