"""
NFH Inbound Reply Triage

Classifies inbound replies and routes accordingly:
- BOOKING: Wants to schedule → Send Cal.com link
- INTERESTED: Positive response → Route to sales
- AUTO_REPLY: Bounce/OOO → Update lead status
- REJECT: Negative/unsubscribe → Add to suppression
"""

import os
import logging
from typing import Dict, Any, Optional
from enum import Enum

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv()

logger = logging.getLogger(__name__)


class ReplyCategory(str, Enum):
    BOOKING = "BOOKING"
    INTERESTED = "INTERESTED"
    AUTO_REPLY = "AUTO_REPLY"
    REJECT = "REJECT"
    UNKNOWN = "UNKNOWN"


def get_llm():
    """Get OmniRoute-backed LLM."""
    return ChatOpenAI(
        model="groq/llama-3.1-8b-instant",
        temperature=0.1,
        api_key=os.getenv("OMNIROUTE_API_KEY", "omni"),
        base_url=os.getenv("OMNIROUTE_BASE_URL", "http://localhost:20128/v1")
    )


async def classify_reply(reply_body: str) -> Dict[str, Any]:
    """
    Classify an inbound reply using LLM.
    Returns category, sentiment, and recommended action.
    """
    llm = get_llm()

    system_prompt = """You are an email triage classifier for Neural Forge Hub.
    Classify this inbound reply into exactly one category:

    - BOOKING: Lead wants to schedule a call/meeting (asks about calendar, availability, "let's meet", etc.)
    - INTERESTED: Positive response, wants to learn more, asks questions, expresses interest
    - AUTO_REPLY: Out-of-office, auto-responder, bounce notification, delivery status
    - REJECT: Unsubscribes, asks to stop, negative response, not interested, "wrong person"
    - UNKNOWN: Cannot determine intent

    Return your classification in this exact JSON format:
    {"category": "CATEGORY", "sentiment": "positive/neutral/negative", "reason": "brief explanation"}
    """

    try:
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=reply_body[:2000])  # Limit to first 2000 chars
        ])

        import json
        result = json.loads(response.content)

        return {
            "category": ReplyCategory(result.get("category", "UNKNOWN")),
            "sentiment": result.get("sentiment", "neutral"),
            "reason": result.get("reason", ""),
            "raw": response.content
        }
    except Exception as e:
        logger.error(f"Error classifying reply: {e}")
        return {
            "category": ReplyCategory.UNKNOWN,
            "sentiment": "neutral",
            "reason": f"Classification error: {str(e)}",
            "raw": ""
        }


async def handle_booking_reply(lead_id: int, lead_email: str) -> None:
    """
    Lead wants to book. Send Cal.com link or create meeting.
    """
    logger.info(f"Lead {lead_id} wants to book a meeting")

    # Get Cal.com integration
    cal_link = os.getenv("CAL_COM_BOOKING_LINK", "https://cal.com/nfh-systems")

    # Send booking email via dispatcher
    from dispatcher import send_email

    booking_email = {
        "id": lead_id,
        "email": lead_email,
        "first_name": "",
        "company_name": "",
        "domain": ""
    }

    draft = {
        "subject": "re: technical observation",
        "final_payload": (
            "Hi,\n\n"
            "Great to hear from you. You can book a 10-minute sync here:\n\n"
            f"{cal_link}\n\n"
            "Looking forward to chatting.\n\n"
            "---\n"
            f"{os.getenv('NFH_PHYSICAL_ADDRESS', 'Neural Forge Hub')}\n"
            f"To stop: {os.getenv('NFH_UNSUBSCRIBE_URL', 'https://nfh-systems.com/optout')}"
        )
    }

    result = await send_email(booking_email, draft)
    logger.info(f"Booking link sent to {lead_email}: {result}")


async def handle_interested_reply(lead_id: int, lead_email: str, reply_body: str) -> None:
    """
    Lead is interested. Route to sales team.
    """
    logger.info(f"Lead {lead_id} is interested, routing to sales")

    # In production, this would create a CRM task or notify sales
    # For now, just log it
    from db import record_inbound_reply
    record_inbound_reply(lead_id, reply_body, sentiment="positive")


async def handle_auto_reply(lead_id: int) -> None:
    """
    Auto-reply detected. Update lead status but don't take action.
    """
    logger.info(f"Lead {lead_id} triggered auto-reply")

    # Just log it, don't suppress or mark as interested
    pass


async def handle_reject_reply(lead_id: int, lead_email: str) -> None:
    """
    Lead rejected or wants to unsubscribe. Add to suppression.
    """
    logger.info(f"Lead {lead_id} rejected, adding to suppression")

    from db import add_to_suppression, record_inbound_reply

    add_to_suppression(lead_email, reason="lead_rejected")
    record_inbound_reply(lead_id, "", sentiment="negative")


async def classify_and_respond(lead_id: int, reply_body: str) -> None:
    """
    Main triage function. Classifies reply and takes appropriate action.
    """
    from db import get_lead_by_id

    # Get lead info
    lead = get_lead_by_id(lead_id)
    if not lead:
        logger.error(f"Lead {lead_id} not found")
        return

    lead_email = lead.get("email", "")

    # Classify the reply
    classification = await classify_reply(reply_body)
    category = classification["category"]

    logger.info(f"Reply from {lead_email} classified as {category.value}: {classification['reason']}")

    # Take action based on category
    if category == ReplyCategory.BOOKING:
        await handle_booking_reply(lead_id, lead_email)
    elif category == ReplyCategory.INTERESTED:
        await handle_interested_reply(lead_id, lead_email, reply_body)
    elif category == ReplyCategory.AUTO_REPLY:
        await handle_auto_reply(lead_id)
    elif category == ReplyCategory.REJECT:
        await handle_reject_reply(lead_id, lead_email)
    else:
        logger.info(f"Unknown reply from {lead_email}, no action taken")


# Cal.com integration for booking links
async def create_cal_event(lead_email: str, lead_name: str = "") -> Optional[str]:
    """
    Create a Cal.com calendar event for a booking.
    Returns the booking link.
    """
    cal_api_key = os.getenv("CAL_COM_API_KEY")
    cal_user = os.getenv("CAL_COM_USER", "nfh-systems")

    if not cal_api_key:
        # Fall back to booking link
        return os.getenv("CAL_COM_BOOKING_LINK", "https://cal.com/nfh-systems")

    import httpx

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.cal.com/v1/bookings",
                headers={
                    "Authorization": f"Bearer {cal_api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "email": lead_email,
                    "name": lead_name,
                    "eventTypeSlug": "10-min-sync",
                    "user": cal_user
                }
            )

            if response.status_code == 200:
                data = response.json()
                return data.get("bookingUrl")
            else:
                logger.error(f"Cal.com API error: {response.status_code}")
                return None
    except Exception as e:
        logger.error(f"Error creating Cal event: {e}")
        return None


if __name__ == "__main__":
    import asyncio

    logging.basicConfig(level=logging.INFO)

    # Test classification
    test_cases = [
        ("Hi, I'd like to schedule a call to discuss this further.", ReplyCategory.BOOKING),
        ("This is interesting, can you tell me more about your approach?", ReplyCategory.INTERESTED),
        ("I'm out of office until Monday, will respond then.", ReplyCategory.AUTO_REPLY),
        ("Please remove me from your list, I'm not interested.", ReplyCategory.REJECT),
    ]

    for text, expected in test_cases:
        result = asyncio.run(classify_reply(text))
        match = "✓" if result["category"] == expected else "✗"
        print(f"{match} Input: '{text[:50]}...' -> {result['category'].value} (expected: {expected.value})")
