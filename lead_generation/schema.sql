-- NFH Lead Generation Pipeline v5.0 Schema

CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    company_name TEXT,
    domain TEXT NOT NULL,
    contact_country_code TEXT,
    source TEXT,
    source_id TEXT,
    sources TEXT[] DEFAULT '{}',
    channel TEXT,
    tech_stack JSONB,
    intent_signals JSONB,
    last_fetched_at TIMESTAMPTZ,
    last_email_generated_at TIMESTAMPTZ,
    last_email_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);
CREATE INDEX IF NOT EXISTS idx_leads_channel ON leads(channel);
CREATE INDEX IF NOT EXISTS idx_leads_last_fetched ON leads(last_fetched_at);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

CREATE TABLE IF NOT EXISTS generated_emails (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    subject TEXT,
    body TEXT,
    full_payload TEXT,
    sources_used TEXT[] DEFAULT '{}',
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    dispatch_mode TEXT,
    provider_email_id TEXT
);

CREATE TABLE IF NOT EXISTS dead_letter (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER,
    error_type TEXT,
    error_message TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS global_suppression (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    suppressed_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT
);

CREATE TABLE IF NOT EXISTS inbound_replies (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    reply_body TEXT,
    sentiment TEXT,
    replied_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS skipped_sources (
    id SERIAL PRIMARY KEY,
    source_name TEXT,
    reason TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);
