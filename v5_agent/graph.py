import asyncio
from dotenv import load_dotenv
load_dotenv()
from typing import TypedDict, Literal, Optional, List
from langgraph.graph import StateGraph, END
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_openai import ChatOpenAI # Replace with ChatGroq or ChatAnthropic as needed

# Import Phase 1 Modules
from models import ContactProfile, PipelineRoute, TraceResult
from scribe import EmailDraft, append_compliance_footer
from router import route_contact
from observer import run_passive_trace

# ==========================================
# 1. STATE DEFINITION
# ==========================================
class AgentState(TypedDict):
    contact: ContactProfile
    route_decision: PipelineRoute
    trace_data: Optional[TraceResult]
    analyst_insights: str
    architect_observation: str
    email_draft: Optional[EmailDraft]
    final_email_payload: str
    error: Optional[str]

# ==========================================
# 2. LLM INITIALIZATION
# ==========================================
# Use a fast, cost-effective model for routing/analysis, and a highly capable one for writing
llm_analyst = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
llm_architect = ChatOpenAI(model="gpt-4o", temperature=0.3)
llm_scribe = ChatOpenAI(model="gpt-4o", temperature=0.1)

# ==========================================
# 3. NODE DEFINITIONS
# ==========================================

async def router_node(state: AgentState) -> dict:
    """Determines legal routing based on contact location."""
    contact = state["contact"]
    decision = route_contact(contact)
    return {"route_decision": decision}

def conditional_edge_router(state: AgentState) -> Literal["observer", "end_early"]:
    """Routes to observer if US, otherwise ends or queues for manual LinkedIn."""
    if state["route_decision"] == PipelineRoute.EMAIL_CAN_SPAM:
        return "observer"
    elif state["route_decision"] == PipelineRoute.LINKEDIN_OFFICIAL:
        print(f"[ROUTE] {state['contact'].first_name} routed to Manual LinkedIn Queue.")
        return "end_early"
    else:
        print(f"[ROUTE] {state['contact'].first_name} REJECTED (Unknown Jurisdiction).")
        return "end_early"

async def observer_node(state: AgentState) -> dict:
    """Executes the passive browser + public record trace."""
    domain = state["contact"].company_domain
    trace = await run_passive_trace(domain)
    return {"trace_data": trace}

async def analyst_node(state: AgentState) -> dict:
    """Analyzes the trace data and firmographics to find the core technical debt."""
    trace = state["trace_data"]
    contact = state["contact"]
    
    system_prompt = """You are a Senior Staff Engineer at Neural Forge Hub. 
    Analyze the provided passive performance trace and company signals. 
    Identify the single most critical technical bottleneck or missing infrastructure best practice.
    Be brutally honest, highly technical, and concise. Do not use marketing language."""
    
    user_prompt = f"""
    Target: {contact.company_name} ({contact.company_domain})
    Tech Stack: {', '.join(contact.tech_stack) if contact.tech_stack else 'Unknown'}
    Hiring Signals: {', '.join(contact.hiring_intent_signals) if contact.hiring_intent_signals else 'None'}
    
    Trace Data:
    - TTFB: {trace.ttfb_ms}ms
    - DOM Loaded: {trace.dom_content_loaded_ms}ms
    - HSTS: {trace.has_hsts}
    - CSP: {trace.has_csp}
    - WAF Blocked Browser: {trace.waf_blocked}
    - DNS/MX Records present: {bool(trace.dns_a_records and trace.mx_records)}
    """
    
    response = await llm_analyst.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ])
    return {"analyst_insights": response.content}

async def architect_node(state: AgentState) -> dict:
    """Translates the analyst's insight into a specific NFH capability match."""
    insights = state["analyst_insights"]
    
    system_prompt = """You are the Lead Architect at Neural Forge Hub. 
    Based on the analyst's insight, formulate a 1-2 sentence technical observation. 
    Connect their specific bottleneck to a system Neural Forge Hub has actually built 
    (e.g., async FastAPI microservices, Next.js App Router optimization, CUDA-to-HIP porting).
    Keep it grounded. Do not overpromise."""
    
    response = await llm_architect.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Analyst Insights: {insights}")
    ])
    return {"architect_observation": response.content}

async def scribe_node(state: AgentState) -> dict:
    """Drafts the plain-text email. STRICTLY FORBIDDEN from adding opt-out links."""
    contact = state["contact"]
    observation = state["architect_observation"]
    
    system_prompt = """You are an automated engineering bot operated by Neural Forge Hub.
    Write a plain-text email to the target engineer.
    RULES:
    1. Disclose you are an automated bot immediately ("Our automated performance observer flagged...").
    2. State the technical observation clearly.
    3. Ask if they want to see the raw trace data or have a 10-min architecture sync.
    4. Tone: Blunt, professional, lowercase subject line. NO marketing fluff. NO "hope this finds you well".
    5. CRITICAL: Do NOT include any unsubscribe links, physical addresses, or 'reply STOP' instructions. The system appends this automatically."""
    
    user_prompt = f"""
    Target Name: {contact.first_name}
    Domain: {contact.company_domain}
    Observation to include: {observation}
    """
    
    response = await llm_scribe.ainvoke([
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_prompt)
    ])
    
    lines = response.content.strip().split('\n', 1)
    subject = lines[0].replace("Subject: ", "").strip()
    body = lines[1].strip() if len(lines) > 1 else response.content
    
    draft = EmailDraft(subject=subject, body=body)
    return {"email_draft": draft}

def compliance_node(state: AgentState) -> dict:
    """Appends the hardcoded CAN-SPAM footer. Mathematically guaranteed."""
    draft = state["email_draft"]
    final_payload = append_compliance_footer(draft)
    return {"final_email_payload": final_payload}

# ==========================================
# 4. GRAPH COMPILATION
# ==========================================

workflow = StateGraph(AgentState)

# Add Nodes
workflow.add_node("router", router_node)
workflow.add_node("observer", observer_node)
workflow.add_node("analyst", analyst_node)
workflow.add_node("architect", architect_node)
workflow.add_node("scribe", scribe_node)
workflow.add_node("compliance", compliance_node)

# Set Entry Point
workflow.set_entry_point("router")

# Add Edges
workflow.add_conditional_edges(
    "router",
    conditional_edge_router,
    {
        "observer": "observer",
        "end_early": END
    }
)
workflow.add_edge("observer", "analyst")
workflow.add_edge("analyst", "architect")
workflow.add_edge("architect", "scribe")
workflow.add_edge("scribe", "compliance")
workflow.add_edge("compliance", END)

# Compile
app = workflow.compile()

# ==========================================
# 5. EXECUTION EXAMPLE
# ==========================================
async def run_pipeline(contact_data: dict):
    initial_state = AgentState(
        contact=ContactProfile(**contact_data),
        route_decision=None,
        trace_data=None,
        analyst_insights="",
        architect_observation="",
        email_draft=None,
        final_email_payload="",
        error=None
    )
    
    final_state = await app.ainvoke(initial_state)
    return final_state
