"""
NFH Lead Generation Pipeline v5.0 - Database Layer

PostgreSQL connection and operations for:
- Leads management
- Generated emails
- Dead letter queue
- Suppression list
- Inbound replies
"""

import os
import psycopg2
from psycopg2.extras import Json, execute_values
from psycopg2 import pool
from dotenv import load_dotenv
import logging

load_dotenv()

logger = logging.getLogger(__name__)

# Connection pool for better performance
_connection_pool = None


def get_pool():
    """Get or create the connection pool."""
    global _connection_pool
    if _connection_pool is None:
        _connection_pool = pool.ThreadedConnectionPool(
            minconn=1,
            maxconn=10,
            dbname=os.getenv("DB_NAME", "nfh_leads"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "postgres"),
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5432")
        )
    return _connection_pool


def get_connection():
    """Get a connection from the pool."""
    return get_pool().getconn()


def return_connection(conn):
    """Return a connection to the pool."""
    get_pool().putconn(conn)


def init_db():
    """Initialize the database schema."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            # Leads table
            cur.execute("""
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
            """)

            # Generated emails table
            cur.execute("""
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
            """)

            # Dead letter table
            cur.execute("""
                CREATE TABLE IF NOT EXISTS dead_letter (
                    id SERIAL PRIMARY KEY,
                    lead_id INTEGER,
                    error_type TEXT,
                    error_message TEXT,
                    logged_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)

            # Global suppression list
            cur.execute("""
                CREATE TABLE IF NOT EXISTS global_suppression (
                    id SERIAL PRIMARY KEY,
                    email TEXT UNIQUE,
                    suppressed_at TIMESTAMPTZ DEFAULT NOW(),
                    reason TEXT
                );
            """)

            # Inbound replies
            cur.execute("""
                CREATE TABLE IF NOT EXISTS inbound_replies (
                    id SERIAL PRIMARY KEY,
                    lead_id INTEGER REFERENCES leads(id),
                    reply_body TEXT,
                    sentiment TEXT,
                    replied_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)

            # Skipped sources log
            cur.execute("""
                CREATE TABLE IF NOT EXISTS skipped_sources (
                    id SERIAL PRIMARY KEY,
                    source_name TEXT,
                    reason TEXT,
                    logged_at TIMESTAMPTZ DEFAULT NOW()
                );
            """)

            # Indexes
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_domain ON leads(domain);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_channel ON leads(channel);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_last_fetched ON leads(last_fetched_at);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_leads_email_can_spam ON leads(channel, tech_stack) WHERE channel = 'EMAIL_CAN_SPAM';")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_dead_letter_lead ON dead_letter(lead_id);")
            cur.execute("CREATE INDEX IF NOT EXISTS idx_suppression_email ON global_suppression(email);")

            conn.commit()
            logger.info("Database schema initialized successfully.")
    except Exception as e:
        conn.rollback()
        logger.error(f"Error initializing database: {e}")
        raise
    finally:
        return_connection(conn)


# ============ Lead Operations ============

def upsert_lead(lead_data: dict) -> int:
    """
    Insert or update a lead based on email.
    Returns the lead ID.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO leads (
                    email, first_name, last_name, company_name, domain,
                    contact_country_code, source, source_id, sources,
                    channel, tech_stack, intent_signals
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (email) DO UPDATE SET
                    first_name = COALESCE(EXCLUDED.first_name, leads.first_name),
                    last_name = COALESCE(EXCLUDED.last_name, leads.last_name),
                    company_name = COALESCE(EXCLUDED.company_name, leads.company_name),
                    domain = COALESCE(EXCLUDED.domain, leads.domain),
                    contact_country_code = COALESCE(EXCLUDED.contact_country_code, leads.contact_country_code),
                    channel = COALESCE(EXCLUDED.channel, leads.channel),
                    sources = (
                        SELECT array_agg(DISTINCT src)
                        FROM unnest(COALESCE(leads.sources, '{}') || COALESCE(EXCLUDED.sources, '{}')) as src
                    ),
                    intent_signals = COALESCE(leads.intent_signals, '{}'::jsonb) || COALESCE(EXCLUDED.intent_signals, '{}'::jsonb),
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id;
            """, (
                lead_data.get("email"),
                lead_data.get("first_name"),
                lead_data.get("last_name"),
                lead_data.get("company_name"),
                lead_data.get("domain"),
                lead_data.get("contact_country_code"),
                lead_data.get("source"),
                lead_data.get("source_id"),
                lead_data.get("sources", []),
                lead_data.get("channel"),
                Json(lead_data.get("tech_stack", {})),
                Json(lead_data.get("intent_signals", {}))
            ))
            result = cur.fetchone()
            conn.commit()
            return result[0] if result else None
    except Exception as e:
        conn.rollback()
        logger.error(f"Error upserting lead: {e}")
        raise
    finally:
        return_connection(conn)


def get_lead_by_id(lead_id: int) -> dict:
    """Fetch a single lead by ID."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads WHERE id = %s;", (lead_id,))
            row = cur.fetchone()
            if row:
                cols = [desc[0] for desc in cur.description]
                return dict(zip(cols, row))
            return None
    finally:
        return_connection(conn)


def get_lead_by_email(email: str) -> dict:
    """Fetch a single lead by email."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM leads WHERE email = %s;", (email,))
            row = cur.fetchone()
            if row:
                cols = [desc[0] for desc in cur.description]
                return dict(zip(cols, row))
            return None
    finally:
        return_connection(conn)


# ============ Tech Stack Operations ============

def update_lead_tech_stack(domain: str, tech_stack: dict) -> None:
    """Update the tech stack for a lead."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE leads
                SET tech_stack = %s, last_fetched_at = CURRENT_TIMESTAMP
                WHERE domain = %s;
            """, (Json(tech_stack), domain))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error updating tech stack: {e}")
        raise
    finally:
        return_connection(conn)


def get_leads_to_fingerprint(limit: int = 100) -> list:
    """Fetch leads that need fingerprinting."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, domain, last_fetched_at, tech_stack
                FROM leads
                WHERE tech_stack IS NULL
                  AND domain IS NOT NULL
                  AND (last_fetched_at IS NULL OR last_fetched_at < NOW() - INTERVAL '24 hours')
                LIMIT %s;
            """, (limit,))
            return cur.fetchall()
    finally:
        return_connection(conn)


# ============ Email Generation Operations ============

def get_leads_for_email(limit: int = 30) -> list:
    """
    Fetch eligible leads for email generation.
    Criteria:
    - channel = 'EMAIL_CAN_SPAM'
    - tech_stack IS NOT NULL
    - intent_signals IS NOT NULL
    - last_email_generated_at IS NULL OR < NOW() - INTERVAL '30 days'
    """
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, email, first_name, company_name, domain,
                       tech_stack, intent_signals, sources
                FROM leads
                WHERE channel = 'EMAIL_CAN_SPAM'
                  AND tech_stack IS NOT NULL
                  AND intent_signals IS NOT NULL
                  AND email IS NOT NULL
                  AND (last_email_generated_at IS NULL OR last_email_generated_at < NOW() - INTERVAL '30 days')
                  AND email NOT IN (SELECT email FROM global_suppression)
                LIMIT %s;
            """, (limit,))
            rows = cur.fetchall()
            cols = [desc[0] for desc in cur.description]
            return [dict(zip(cols, row)) for row in rows]
    finally:
        return_connection(conn)


def store_generated_email(
    lead_id: int,
    subject: str,
    body: str,
    sources_used: list = None
) -> int:
    """Store a generated email and update the lead's timestamp."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO generated_emails (lead_id, subject, body, sources_used)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
            """, (lead_id, subject, body, sources_used or []))

            cur.execute("""
                UPDATE leads
                SET last_email_generated_at = CURRENT_TIMESTAMP
                WHERE id = %s;
            """, (lead_id,))

            conn.commit()
            result = cur.fetchone()
            return result[0] if result else None
    except Exception as e:
        conn.rollback()
        logger.error(f"Error storing generated email: {e}")
        raise
    finally:
        return_connection(conn)


# ============ Dead Letter Operations ============

def log_dead_letter(lead_id: int, error_type: str, error_message: str) -> None:
    """Log a failure to the dead letter table."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO dead_letter (lead_id, error_type, error_message)
                VALUES (%s, %s, %s);
            """, (lead_id, error_type, error_message))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error logging dead letter: {e}")
    finally:
        return_connection(conn)


def get_dead_letters(limit: int = 100) -> list:
    """Fetch recent dead letters for review."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT dl.*, l.domain, l.email
                FROM dead_letter dl
                LEFT JOIN leads l ON dl.lead_id = l.id
                ORDER BY dl.logged_at DESC
                LIMIT %s;
            """, (limit,))
            return cur.fetchall()
    finally:
        return_connection(conn)


# ============ Suppression Operations ============

def is_suppressed(email: str) -> bool:
    """Check if an email is in the suppression list."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 1 FROM global_suppression WHERE email = %s;
            """, (email.lower(),))
            return cur.fetchone() is not None
    finally:
        return_connection(conn)


def add_to_suppression(email: str, reason: str = "manual") -> None:
    """Add an email to the global suppression list."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO global_suppression (email, reason)
                VALUES (%s, %s)
                ON CONFLICT (email) DO UPDATE SET
                    suppressed_at = CURRENT_TIMESTAMP,
                    reason = EXCLUDED.reason;
            """, (email.lower(), reason))
            conn.commit()
            logger.info(f"Added {email} to suppression list: {reason}")
    except Exception as e:
        conn.rollback()
        logger.error(f"Error adding to suppression: {e}")
    finally:
        return_connection(conn)


def remove_from_suppression(email: str) -> None:
    """Remove an email from the suppression list."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM global_suppression WHERE email = %s;
            """, (email.lower(),))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error removing from suppression: {e}")
    finally:
        return_connection(conn)


# ============ Skipped Sources Logging ============

def log_skipped_source(source_name: str, reason: str) -> None:
    """Log a source that was skipped due to missing config."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO skipped_sources (source_name, reason)
                VALUES (%s, %s);
            """, (source_name, reason))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error logging skipped source: {e}")
    finally:
        return_connection(conn)


# ============ Inbound Replies ============

def record_inbound_reply(lead_id: int, reply_body: str, sentiment: str = None) -> None:
    """Record an inbound reply from a lead."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO inbound_replies (lead_id, reply_body, sentiment)
                VALUES (%s, %s, %s);
            """, (lead_id, reply_body, sentiment))
            conn.commit()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error recording reply: {e}")
    finally:
        return_connection(conn)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_db()
    logger.info("Database module loaded successfully.")
