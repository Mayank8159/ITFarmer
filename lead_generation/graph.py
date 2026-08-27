import os
import json
from typing import Dict, Any, TypedDict, List
from dotenv import load_dotenv

load_dotenv()

from langchain_openai import ChatOpenAI
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import StateGraph, START, END

# Define the state schema
class EmailGenerationState(TypedDict):
    lead_id: int
    domain: str
    tech_stack: Dict[str, Any]
    intent_signals: Dict[str, Any]
    sources: List[str]
    analyst_output: str
    final_subject: str
    final_body: str
    status: str
    error: str

# Node 1: Analyst Node
def analyst_node(state: EmailGenerationState) -> EmailGenerationState:
    llm = ChatOpenAI(
        model="grok-3-mini",
        base_url="https://api.x.ai/v1",
        api_key=os.getenv("XAI_API_KEY", "dummy"),
        max_retries=1
    )

    tech_stack_str = json.dumps(state["tech_stack"], indent=2)
    intent_signals_str = json.dumps(state["intent_signals"], indent=2)
    num_sources = len(state["sources"]) if state.get("sources") else 1
    
    system_prompt = (
        "You are a technical analyst evaluating a company's architecture based on public signals.\n"
        "Your task is to write a 2-3 sentence technical observation about where the provided tech stack "
        "will struggle at scale (e.g., cold starts, connection limits, quota walls, state management).\n"
        f"You MUST include this phrase referencing their footprint: 'Based on your public footprint across {num_sources} data sources...'\n"
        "Rules:\n"
        "- Pure ASCII only.\n"
        "- NO emojis.\n"
        "- Do not write a greeting or a sign-off. Just the observation.\n"
    )

    human_message = f"Tech Stack:\n{tech_stack_str}\n\nIntent Signals:\n{intent_signals_str}"

    try:
        response = llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=human_message)])
        state["analyst_output"] = response.content
        state["status"] = "analyst_success"
    except Exception as e:
        state["status"] = "failed"
        state["error"] = str(e)

    return state

# Node 2: Scribe Node
def scribe_node(state: EmailGenerationState) -> EmailGenerationState:
    if state["status"] == "failed":
        return state

    llm = ChatOpenAI(
        model="grok-3-mini",
        base_url="https://api.x.ai/v1",
        api_key=os.getenv("XAI_API_KEY", "dummy"),
        max_retries=1
    )

    system_prompt = (
        "You are an automated scribe generating an outbound email to an engineering leader.\n"
        "Constraints:\n"
        "1. MUST disclose bot: 'Our automated engineering observer flagged...'\n"
        "2. Subject must be lowercase, technical, and boring (e.g. 'latency on {domain}'). Output this on the first line prefixed with 'SUBJECT: '.\n"
        "3. Body must be 4 sentences MAX, plain text only, no HTML/markdown/images/pixels.\n"
        "4. NEVER mention opt-out, unsubscribe, or physical address. (This is handled by compliance).\n"
        "5. You MUST use the provided analyst output verbatim as the core of your email. Do not improvise the technical finding.\n"
    )

    human_message = f"Domain: {state['domain']}\n\nAnalyst Output:\n{state['analyst_output']}"

    try:
        response = llm.invoke([SystemMessage(content=system_prompt), HumanMessage(content=human_message)])
        content = response.content.strip()
        
        # Parse subject and body
        lines = content.split("\n")
        subject = "latency concern"
        body_lines = []
        for line in lines:
            if line.upper().startswith("SUBJECT:"):
                subject = line[8:].strip()
            else:
                body_lines.append(line)
        
        state["final_subject"] = subject
        state["final_body"] = "\n".join(body_lines).strip()
        state["status"] = "scribe_success"
    except Exception as e:
        state["status"] = "failed"
        state["error"] = str(e)

    return state

# Node 3: Compliance Node
def compliance_node(state: EmailGenerationState) -> EmailGenerationState:
    if state["status"] == "failed":
        return state

    physical_address = os.getenv("NFH_PHYSICAL_ADDRESS", "123 Default Ave, SF, CA")
    unsubscribe_url = os.getenv("NFH_UNSUBSCRIBE_URL", "https://example.com/unsubscribe")

    footer = (
        "\n---\n"
        f"Neural Forge Hub, {physical_address}\n"
        f"To stop receiving observations, reply STOP or visit {unsubscribe_url}"
    )

    state["final_body"] += footer
    state["status"] = "success"
    return state

# Build Graph
builder = StateGraph(EmailGenerationState)
builder.add_node("analyst_node", analyst_node)
builder.add_node("scribe_node", scribe_node)
builder.add_node("compliance_node", compliance_node)

builder.add_edge(START, "analyst_node")
builder.add_edge("analyst_node", "scribe_node")
builder.add_edge("scribe_node", "compliance_node")
builder.add_edge("compliance_node", END)

email_graph = builder.compile()

def generate_email_for_lead(lead_data: Dict[str, Any]) -> EmailGenerationState:
    """Helper function to run the graph for a single lead."""
    initial_state = EmailGenerationState(
        lead_id=lead_data["id"],
        domain=lead_data["domain"],
        tech_stack=lead_data["tech_stack"],
        intent_signals=lead_data["intent_signals"],
        sources=lead_data.get("sources", []),
        analyst_output="",
        final_subject="",
        final_body="",
        status="started",
        error=""
    )
    
    result = email_graph.invoke(initial_state)
    return result
