# NFH Acquisition Pipeline v5.0

Neural Forge Hub's B2B lead acquisition system for engineering leaders.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Multi-Source Lead Ingestion                  │
│  ┌─────────┐  ┌───────────────┐  ┌────────────┐  ┌─────────┐ │
│  │ Apollo  │  │ OpenCorporates│  │  GitHub    │  │ JobBoard│ │
│  └────┬────┘  └───────┬───────┘  └──────┬─────┘  └────┬────┘ │
│       │                │                   │             │       │
└───────┼────────────────┼───────────────────┼─────────────┼───────┘
        │                │                   │             │
        ▼                ▼                   ▼             ▼
┌───────────��─────────────────────────────────────────────────────┐
│                    Geo-Routing & Normalization                    │
│  US → EMAIL_CAN_SPAM  |  EU/UK/CA/AU → NURTURE  |  Other → REJECT│
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Tech-Stack Fingerprinting                      │
│              robots.txt compliant • 24h cooldown                 │
│                    Wappalyzer + Homepage GET                     │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LangGraph Agent Swarm                           │
│  ┌─────────┐    ┌───────────┐    ┌────────┐    ┌────────────┐ │
│  │ Analyst │───▶│ Architect │───▶│ Scribe │───▶│ Compliance │ │
│  └─────────┘    └───────────┘    └────────┘    └────────────┘ │
│       │                                                   │      │
│       └─────────── OmniRoute (Groq) ──────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Email Dispatch                             │
│              Plain-text only • Compliance footer                   │
│              Dry-run mode • Resend integration                    │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Inbound Reply Triage                         │
│         BOOKING • INTERESTED • AUTO_REPLY • REJECT              │
│                    Cal.com booking link                          │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. Install Dependencies

```bash
cd lead_generation
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env` and configure your API keys:

```bash
cp .env.example .env
```

Edit `.env` with your keys:

```env
# OmniRoute (Groq via localhost proxy)
OMNIROUTE_BASE_URL=http://localhost:20128/v1
OMNIROUTE_API_KEY=omni
GROQ_API_KEY=gsk_your_real_key_here

# Resend (email delivery)
RESEND_API_KEY=re_your_real_key_here
SENDER_EMAIL=engineering@nfh-systems.com

# Apollo
APOLLO_API_KEY=your_apollo_key_here

# Compliance
NFH_PHYSICAL_ADDRESS=Neural Forge Hub, 251 Little Falls Drive, Wilmington, DE 19808
NFH_UNSUBSCRIBE_URL=https://nfh-systems.com/optout

# Mode
DISPATCH_MODE=dry_run  # Change to "resend" for live sending
```

### 3. Set Up Database

```bash
# Using Docker Compose
docker-compose up -d postgres

# Run schema
psql $POSTGRES_URL < schema.sql

# Or use the Python init
python -c "from db import init_db; init_db()"
```

### 4. Run the Pipeline

```bash
# Full pipeline (all phases)
python flow.py --flow full

# Individual phases
python flow.py --flow ingest
python flow.py --flow fingerprint
python flow.py --flow email

# Or use the FastAPI server
uvicorn main:app --reload --port 8000
```

## CLI Usage

### Ingest Leads

```bash
python flow.py --flow ingest --hiring-titles "Backend Engineer" "ML Engineer"
```

### Fingerprint Tech Stacks

```bash
python flow.py --flow fingerprint
```

### Generate Emails

```bash
python generate_emails.py --limit 30 --delay 2.0
```

### Run API Server

```bash
# Start server
uvicorn main:app --reload --port 8000

# Ingest via API
curl -X POST http://localhost:8000/api/v1/campaigns/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "leads": [{
      "email": "engineer@startup.com",
      "first_name": "John",
      "company_name": "Startup Inc",
      "domain": "startup.com",
      "contact_country_code": "US"
    }]
  }'

# Health check
curl http://localhost:8000/api/v1/health

# Opt-out webhook
curl -X POST http://localhost:8000/api/v1/webhooks/optout \
  -H "Content-Type: application/json" \
  -d '{"email": "unsubscribe@company.com"}'
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/campaigns/ingest` | Ingest lead batch |
| POST | `/api/v1/webhooks/optout` | Handle opt-out |
| POST | `/api/v1/webhooks/bounce` | Handle bounce |
| POST | `/api/v1/webhooks/reply` | Handle inbound reply |
| GET | `/api/v1/leads` | List leads |
| GET | `/api/v1/stats` | Pipeline statistics |

## Geo-Routing

| Region | Channel | Action |
|--------|---------|--------|
| US | `EMAIL_CAN_SPAM` | Cold email eligible |
| EU/UK/CA/AU | `NURTURE` | No cold email, nurture only |
| Other | `REJECT` | No contact |

## Compliance

- **Plain-text only**: No HTML, tracking pixels, or images in emails
- **Compliance footer**: Appended by code (not LLM)
- **Unsubscribe mechanism**: Via webhook or direct link
- **Suppression list**: Enforced on all sends
- **No scraping**: APIs only, robots.txt compliant

## Testing

```bash
# Run all tests
pytest test_pipeline.py -v

# Run specific test class
pytest test_pipeline.py::TestGeoRouting -v

# Run with coverage
pytest test_pipeline.py --cov=. --cov-report=html
```

## Prefect Orchestration

Deploy flows to Prefect Orion:

```python
from flow import full_pipeline

# Register flow
full_pipeline.serve(name="weekly-nfh-pipeline", schedule=IntervalSchedule(interval=timedelta(weeks=1)))
```

Or run as a local agent:

```bash
prefect agent start
```

## Project Structure

```
lead_generation/
├── .env                 # Environment variables
├── docker-compose.yml   # PostgreSQL + Redis
├── schema.sql          # Database schema
├── requirements.txt    # Python dependencies
│
├── apollo_client.py    # Apollo.io API client
├── sources.py          # Multi-source clients
├── normalize.py        # Lead normalization & geo-routing
├── fingerprinter.py   # Tech stack fingerprinting
│
├── graph.py           # LangGraph agent swarm
├── dispatcher.py      # Email dispatch (Resend)
├── triage.py          # Inbound reply triage
│
├── db.py              # Database operations
├── main.py            # FastAPI control plane
├── flow.py            # Prefect flows
├── generate_emails.py # Standalone email generation
│
└── test_pipeline.py   # Test suite
```

## Troubleshooting

### OmniRoute Connection Error

Make sure OmniRoute is running on port 20128:

```bash
# Check if port is open
nc -zv localhost 20128
```

### Apollo API Errors

Check your API key is valid and has sufficient quota:

```bash
curl -H "X-Api-Key: YOUR_KEY" https://api.apollo.io/v1/health
```

### Database Connection

Verify PostgreSQL is running:

```bash
docker ps | grep postgres
psql $POSTGRES_URL -c "SELECT 1"
```

## License

Proprietary - Neural Forge Hub
