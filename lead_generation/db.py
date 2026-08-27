import os
import psycopg2
from psycopg2.extras import Json
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

def get_connection():
    """Get a connection to the PostgreSQL database."""
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "postgres"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
        return conn
    except Exception as e:
        logger.error(f"Error connecting to database: {e}")
        raise

def init_db():
    """Initialize the database schema."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS leads (
                    id SERIAL PRIMARY KEY,
                    company_name VARCHAR(255),
                    domain VARCHAR(255) UNIQUE NOT NULL,
                    contact_name VARCHAR(255),
                    contact_email VARCHAR(255),
                    intent_signals JSONB,
                    tech_stack JSONB,
                    last_fetched_at TIMESTAMP WITH TIME ZONE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)

            # Run ALTER TABLE to ensure existing DB has the new columns
            cur.execute("""
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS source_id TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS sources TEXT[] DEFAULT '{}';
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS channel TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS country TEXT;
                ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_email_generated_at TIMESTAMP WITH TIME ZONE;
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS dead_letter (
                    id SERIAL PRIMARY KEY,
                    domain VARCHAR(255) NOT NULL,
                    error_reason TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                );
            """)
            
            cur.execute("""
                CREATE TABLE IF NOT EXISTS skipped_sources (
                    id SERIAL PRIMARY KEY,
                    source_name TEXT,
                    reason TEXT,
                    logged_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)

            cur.execute("""
                CREATE TABLE IF NOT EXISTS generated_emails (
                    id SERIAL PRIMARY KEY,
                    lead_id INTEGER REFERENCES leads(id),
                    subject TEXT,
                    body TEXT,
                    full_payload JSONB,
                    generated_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)

            cur.execute("""
                ALTER TABLE generated_emails ADD COLUMN IF NOT EXISTS sources_used TEXT[] DEFAULT '{}';
            """)

            # Index for faster deduplication and lookups
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);")
            conn.commit()
            logger.info("Database schema initialized successfully.")
    except Exception as e:
        conn.rollback()
        logger.error(f"Error initializing database: {e}")
        raise
    finally:
        conn.close()

def upsert_lead(conn, lead_data):
    """
    Insert a new lead or update an existing one based on the domain.
    """
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leads (company_name, domain, contact_name, contact_email, intent_signals)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (domain) DO UPDATE SET
                    company_name = EXCLUDED.company_name,
                    contact_name = EXCLUDED.contact_name,
                    contact_email = EXCLUDED.contact_email,
                    intent_signals = EXCLUDED.intent_signals,
                    updated_at = CURRENT_TIMESTAMP;
            """, (
                lead_data.get('company_name'),
                lead_data.get('domain'),
                lead_data.get('contact_name'),
                lead_data.get('contact_email'),
                Json(lead_data.get('intent_signals', {}))
            ))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error upserting lead for domain {lead_data.get('domain')}: {e}")
        raise

def upsert_lead_multi_source(conn, lead_data):
    """
    Insert a new lead or update an existing one based on the domain.
    On conflict, fills missing fields and appends the source to the sources array without duplicates.
    """
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leads (
                    company_name, domain, contact_name, contact_email, 
                    intent_signals, source, source_id, sources, channel, country
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, ARRAY[%s]::TEXT[], %s, %s)
                ON CONFLICT (domain) DO UPDATE SET
                    company_name = COALESCE(leads.company_name, EXCLUDED.company_name),
                    contact_name = COALESCE(leads.contact_name, EXCLUDED.contact_name),
                    contact_email = COALESCE(leads.contact_email, EXCLUDED.contact_email),
                    intent_signals = COALESCE(leads.intent_signals, '{}'::jsonb) || COALESCE(EXCLUDED.intent_signals, '{}'::jsonb),
                    country = COALESCE(leads.country, EXCLUDED.country),
                    channel = COALESCE(leads.channel, EXCLUDED.channel),
                    sources = (
                        SELECT array_agg(DISTINCT src) FROM unnest(array_append(leads.sources, EXCLUDED.source)) as src
                    ),
                    updated_at = CURRENT_TIMESTAMP;
            """, (
                lead_data.get('company_name'),
                lead_data.get('domain'),
                lead_data.get('contact_name'),
                lead_data.get('contact_email'),
                Json(lead_data.get('intent_signals', {})),
                lead_data.get('source'),
                lead_data.get('source_id'),
                lead_data.get('source'),
                lead_data.get('channel'),
                lead_data.get('country')
            ))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error upserting multi-source lead for domain {lead_data.get('domain')}: {e}")
        raise

def log_skipped_source(conn, source_name, reason):
    """Log a source that was skipped due to missing config or API absence."""
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO skipped_sources (source_name, reason)
                VALUES (%s, %s);
            """, (source_name, reason))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error logging skipped source {source_name}: {e}")
        raise

def update_lead_tech_stack(conn, domain, tech_stack):
    """Update the tech stack for a given domain."""
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE leads
                SET tech_stack = %s, last_fetched_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
                WHERE domain = %s;
            """, (Json(tech_stack), domain))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error updating tech stack for {domain}: {e}")
        raise

def update_lead_last_fetched(conn, domain):
    """Update the last_fetched_at timestamp for a given domain regardless of success/failure."""
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE leads
                SET last_fetched_at = CURRENT_TIMESTAMP
                WHERE domain = %s;
            """, (domain,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error updating last_fetched_at for {domain}: {e}")
        raise

def log_dead_letter(conn, domain, error_reason):
    """Log a failed fingerprinting attempt to the dead letter table."""
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO dead_letter (domain, error_reason)
                VALUES (%s, %s);
            """, (domain, error_reason))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error logging to dead letter for {domain}: {e}")
        raise

def get_leads_to_fingerprint(conn, limit=100):
    """Fetch leads for fingerprinting, returning their ID, domain, and last_fetched_at."""
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, domain, last_fetched_at FROM leads
                WHERE tech_stack IS NULL 
                  AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - INTERVAL '24 hours')
                LIMIT %s;
            """, (limit,))
            return cur.fetchall()
    except Exception as e:
        logger.error(f"Error fetching leads: {e}")
        raise

def get_leads_for_email(conn, limit=30):
    """
    Fetch eligible leads for email generation.
    Criteria:
    - channel = 'EMAIL_CAN_SPAM'
    - tech_stack IS NOT NULL
    - intent_signals IS NOT NULL
    - last_email_generated_at IS NULL OR < NOW() - INTERVAL '30 days'
    """
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, domain, tech_stack, intent_signals, sources 
                FROM leads
                WHERE channel = 'EMAIL_CAN_SPAM'
                  AND tech_stack IS NOT NULL
                  AND intent_signals IS NOT NULL
                  AND (last_email_generated_at IS NULL OR last_email_generated_at < NOW() - INTERVAL '30 days')
                LIMIT %s;
            """, (limit,))
            return cur.fetchall()
    except Exception as e:
        logger.error(f"Error fetching leads for email generation: {e}")
        raise

def store_generated_email(conn, lead_id: int, subject: str, body: str, full_payload: dict, sources_used: list):
    """
    Store the generated email and update the lead's last_email_generated_at timestamp.
    """
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO generated_emails (lead_id, subject, body, full_payload, sources_used)
                VALUES (%s, %s, %s, %s, %s::TEXT[]);
            """, (lead_id, subject, body, Json(full_payload), sources_used))
            
            cur.execute("""
                UPDATE leads
                SET last_email_generated_at = CURRENT_TIMESTAMP
                WHERE id = %s;
            """, (lead_id,))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error storing generated email for lead {lead_id}: {e}")
        raise

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_db()
