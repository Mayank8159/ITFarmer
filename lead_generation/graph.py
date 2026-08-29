"""
LangGraph Agent Swarm for NFH Acquisition Pipeline v5.0

Agents:
1. Analyst - Evaluates tech stack and identifies bottlenecks
2. Architect - Connects bottleneck to NFH capabilities
3. Scribe - Generates plain-text email
4. Compliance - Appends physical address and unsubscribe

All LLM calls go through OmniRoute (Groq API key).
"""

import os
import json
from typing import Dict, Any, TypedDict, List, Optional
from dotenv import load_dotenv

load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, START, END
from pydantic import BaseModel

# Define email draft model
class EmailDraft(BaseModel):
    subject: str
    body: str

# Define the state schema
class AgentState(TypedDict):
    lead_id: int
    email: str
    first_name: str
    company_name: str
    domain: str
    tech_stack: Dict[str, Any]
    intent_signals: Dict[str, Any]
    sources: List[str]
    analyst_insights: str
    architect_observation: str
    email_draft: Optional[EmailDraft]
    final_payload: str
    error: Optional[str]
    status: str


def get_llm():
    """Get OmniRoute-backed LLM (Groq)."""
    return ChatOpenAI(
        model="groq/llama-3.1-8b-instant",
        temperature=0.2,
        api_key=os.getenv("OMNIROUTE_API_KEY", "omni"),
        base_url=os.getenv("OMNIROUTE_BASE_URL", "http://localhost:20128/v1")
    ).with_retry(stop_after_attempt=4)


# Node 1: Analyst Node
async def analyst_node(state: AgentState) -> AgentState:
    """
    Analyzes the company's tech stack and identifies the most critical
    technical bottleneck. Be brutally honest and technical.
    """
    llm = get_llm()

    tech_stack_str = json.dumps(state.get("tech_stack", {}), indent=2)
    intent_signals_str = json.dumps(state.get("intent_signals", {}), indent=2)
    num_sources = len(state.get("sources", [])) or 1

    system_prompt = (
        "You are a Senior Staff Engineer at Neural Forge Hub.\n"
        "Analyze this company's tech stack and identify the single most critical technical bottleneck.\n"
        f"Based on your public footprint across {num_sources} data source(s)...\n"
        "Be brutally honest, highly technical, concise. No marketing language.\n"
        "Rules:\n"
        "- Pure ASCII only.\n"
        "- NO emojis.\n"
        "- Do not write a greeting or a sign-off. Just the technical observation."
    )

    human_message = (
        f"Company: {state.get('company_name', 'Unknown')}\n"
        f"Tech Stack:\n{tech_stack_str}\n\n"
        f"Intent Signals:\n{intent_signals_str}"
    )

    try:
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message)
        ])
        state["analyst_insights"] = response.content
        state["status"] = "analyst_success"
    except Exception as e:
        state["status"] = "failed"
        state["error"] = f"Analyst error: {str(e)}"

    return state


# Node 2: Architect Node
async def architect_node(state: AgentState) -> AgentState:
    """
    Formulates a technical observation connecting the bottleneck
    to a system Neural Forge Hub has built.
    """
    if state.get("status") == "failed":
        return state

    llm = get_llm()

    system_prompt = (
        "You are a Principal Architect at Neural Forge Hub.\n"
        "Based on the analyst's insight, formulate a 1-2 sentence technical observation.\n"
        "Connect their bottleneck to a specific system Neural Forge Hub has built.\n"
        "Be precise, technical, and specific.\n"
        "Rules:\n"
        "- Pure ASCII only.\n"
        "- NO emojis.\n"
        "- Do not write a greeting or a sign-off."
    )

    human_message = (
        f"Company: {state.get('company_name', 'Unknown')}\n"
        f"Analyst Insight:\n{state.get('analyst_insights', '')}"
    )

    try:
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message)
        ])
        state["architect_observation"] = response.content
        state["status"] = "architect_success"
    except Exception as e:
        state["status"] = "failed"
        state["error"] = f"Architect error: {str(e)}"

    return state


# Node 3: Scribe Node
async def scribe_node(state: AgentState) -> AgentState:
    """
    Writes a plain-text email disclosing bot identity and stating
    the technical observation. Asks for a 10-min sync.
    """
    if state.get("status") == "failed":
        return state

    llm = get_llm()

    system_prompt = (
        "You are an automated engineering observer bot.\n"
        "Write a plain-text email to the engineering leader.\n"
        "Constraints:\n"
        "1. MUST disclose bot identity: 'Our automated engineering observer flagged...'\n"
        "2. Subject must be lowercase, technical, and specific. Output first line prefixed with 'SUBJECT: '.\n"
        "3. Body must be 4 sentences MAX, plain text only, no HTML/markdown/images/pixels.\n"
        "4. Ask if they want to see trace data or have a 10-min sync.\n"
        "5. NEVER mention opt-out, unsubscribe, or physical address. (Compliance handles this).\n"
        "6. You MUST use the provided architect observation verbatim.\n"
        "7. Use first name: {first_name}\n".format(first_name=state.get("first_name", "there"))
    )

    human_message = (
        f"Domain: {state.get('domain', '')}\n"
        f"Company: {state.get('company_name', 'Unknown')}\n"
        f"Architect Observation:\n{state.get('architect_observation', '')}"
    )

    try:
        response = await llm.ainvoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_message)
        ])

        content = response.content.strip()

        # Parse subject and body
        lines = content.split("\n")
        subject = "technical observation"
        body_lines = []

        for line in lines:
            if line.upper().startswith("SUBJECT:"):
                subject = line[8:].strip()
            else:
                body_lines.append(line)

        body = "\n".join(body_lines).strip()

        state["email_draft"] = EmailDraft(subject=subject, body=body)
        state["status"] = "scribe_success"
    except Exception as e:
        state["status"] = "failed"
        state["error"] = f"Scribe error: {str(e)}"

    return state


# Node 4: Compliance Node
def compliance_node(state: AgentState) -> AgentState:
    """
    Appends the compliance footer (physical address + unsubscribe URL).
    This is done by code, NOT by LLM prompt.
    """
    if state.get("status") == "failed":
        return state

    if not state.get("email_draft"):
        state["status"] = "failed"
        state["error"] = "No email draft to process"
        return state

    physical_address = os.getenv(
        "NFH_PHYSICAL_ADDRESS",
        "Neural Forge Hub, 251 Little Falls Drive, Wilmington, DE 19808"
    )
    unsubscribe_url = os.getenv(
        "NFH_UNSUBSCRIBE_URL",
        "https://nfh-systems.com/optout"
    )

    # Compliance footer appended by CODE, not LLM
    footer = (
        f"\n---\n"
        f"{physical_address}\n"
        f"To stop receiving observations: {unsubscribe_url}"
    )

    state["final_payload"] = state["email_draft"].body + footer
    state["status"] = "success"

    return state


# Build the LangGraph
builder = StateGraph(AgentState)

builder.add_node("analyst", analyst_node)
builder.add_node("architect", architect_node)
builder.add_node("scribe", scribe_node)
builder.add_node("compliance", compliance_node)

builder.add_edge(START, "analyst")
builder.add_edge("analyst", "architect")
builder.add_edge("architect", "scribe")
builder.add_edge("scribe", "compliance")
builder.add_edge("compliance", END)

email_graph = builder.compile()


async def generate_email_for_lead(lead_data: Dict[str, Any]) -> AgentState:
    """
    Main entry point to generate an email for a lead.
    Runs the full LangGraph pipeline.
    """
    initial_state = AgentState(
        lead_id=lead_data.get("id", 0),
        email=lead_data.get("email", ""),
        first_name=lead_data.get("first_name", ""),
        company_name=lead_data.get("company_name", ""),
        domain=lead_data.get("domain", ""),
        tech_stack=lead_data.get("tech_stack", {}),
        intent_signals=lead_data.get("intent_signals", {}),
        sources=lead_data.get("sources", []),
        analyst_insights="",
        architect_observation="",
        email_draft=None,
        final_payload="",
        error="",
        status="started"
    )

    result = await email_graph.ainvoke(initial_state)
    return result


# Sync wrapper for Prefect tasks
def generate_email_for_lead_sync(lead_data: Dict[str, Any]) -> AgentState:
    """Synchronous wrapper for generate_email_for_lead."""
    import asyncio
    return asyncio.run(generate_email_for_lead(lead_data))


if __name__ == "__main__":
    # Test the graph
    import asyncio

    test_lead = {
        "id": 1,
        "email": "test@example.com",
        "first_name": "John",
        "company_name": "Test Corp",
        "domain": "example.com",
        "tech_stack": {"frameworks": ["Next.js", "Node.js"], "hosting": ["Vercel"]},
        "intent_signals": {"hiring": 1},
        "sources": ["apollo"]
    }

    result = asyncio.run(generate_email_for_lead(test_lead))
    print(f"Status: {result['status']}")
    print(f"Subject: {result['email_draft'].subject if result.get('email_draft') else 'N/A'}")
    print(f"Body:\n{result.get('final_payload', 'N/A')}")
