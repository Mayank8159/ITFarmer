from enum import Enum
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

class ReplySentiment(str, Enum):
    POSITIVE_MEETING_READY = "POSITIVE_MEETING_READY"
    POSITIVE_MORE_INFO = "POSITIVE_MORE_INFO"
    NEGATIVE_OPTOUT = "NEGATIVE_OPTOUT"
    OUT_OF_OFFICE = "OUT_OF_OFFICE"
    UNKNOWN = "UNKNOWN"

class ReplyClassification(BaseModel):
    sentiment: ReplySentiment = Field(..., description="The classified sentiment of the reply.")
    reasoning: str = Field(..., description="A short 1-sentence reason for this classification.")

TRIAGE_PROMPT = """You are an Executive Assistant AI at Neural Forge Hub.
Read the following inbound email reply from a prospect we reached out to.
Determine their sentiment and intent.

Email Reply:
{email_body}

Strict rules:
- If they ask to be removed, unsubscribe, or show annoyance, choose NEGATIVE_OPTOUT.
- If they are out of the office, choose OUT_OF_OFFICE.
- If they ask a technical question but aren't ready to meet, choose POSITIVE_MORE_INFO.
- If they express interest in talking, syncing, or seeing a demo, choose POSITIVE_MEETING_READY.
"""

async def classify_reply(email_body: str) -> ReplyClassification:
    """Classifies an inbound reply using structured LLM output."""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.0)
    structured_llm = llm.with_structured_output(ReplyClassification)
    prompt = ChatPromptTemplate.from_template(TRIAGE_PROMPT)
    chain = prompt | structured_llm
    
    classification: ReplyClassification = await chain.ainvoke({"email_body": email_body})
    return classification
