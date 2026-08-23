import asyncio
from playwright.async_api import async_playwright
import dns.resolver
import httpx
from models import TraceResult

async def channel_browser(domain: str, trace: TraceResult):
    """Channel 1: Honest headless browser load."""
    url = f"https://{domain}"
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        try:
            response = await page.goto(url, wait_until="domcontentloaded", timeout=15000)
            if response and response.status == 200:
                trace.browser_success = True
                timing = await page.evaluate("""() => {
                    const perf = performance.getEntriesByType('navigation')[0];
                    return {
                        ttfb: perf.responseStart - perf.requestStart,
                        domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart
                    };
                }""")
                trace.ttfb_ms = int(timing['ttfb'])
                trace.dom_content_loaded_ms = int(timing['domContentLoaded'])
                headers = response.headers
                trace.has_hsts = 'strict-transport-security' in headers
                trace.has_csp = 'content-security-policy' in headers
            elif response and response.status in [403, 429, 503]:
                trace.waf_blocked = True # Hard stop. No retry, no bypass.
        except Exception:
            pass # Network error, timeout, etc.
        finally:
            await browser.close()

async def channel_public_records(domain: str, trace: TraceResult):
    """Channel 2: Independent public-record lookups (DNS + CT Logs)."""
    # DNS A Records
    try:
        answers = dns.resolver.resolve(domain, 'A')
        trace.dns_a_records = [rdata.to_text() for rdata in answers]
    except Exception:
        pass
        
    # DNS MX Records
    try:
        mx_answers = dns.resolver.resolve(domain, 'MX')
        trace.mx_records = [rdata.to_text() for rdata in mx_answers]
    except Exception:
        pass

    # Certificate Transparency Logs (crt.sh)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(f"https://crt.sh/?q={domain}&output=json")
            if resp.status_code == 200:
                certs = resp.json()
                if certs:
                    trace.ct_log_issuer = certs[0].get('issuer_name')
    except Exception:
        pass

async def run_passive_trace(domain: str) -> TraceResult:
    trace = TraceResult(domain=domain)
    # Run both channels concurrently
    await asyncio.gather(
        channel_browser(domain, trace),
        channel_public_records(domain, trace)
    )
    return trace
