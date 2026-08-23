from fpdf import FPDF

ORANGE = (255, 106, 0)
INK = (5, 5, 5)
MUTED = (102, 112, 122)

def build_pdf(company: str, baseline: dict, analysis: str, recommendation: str) -> bytes:
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(*INK)
    pdf.cell(0, 10, "AI Infrastructure Blueprint", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*ORANGE)
    pdf.cell(0, 8, f"Prepared for {company} by Neural Forge Hub", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_text_color(*INK)
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 9, "1. Deterministic Baseline (Planning Estimates)", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Courier", "", 10)
    for line in [
        f"Monthly requests      : {baseline['monthly_requests']:,}",
        f"Total tokens / month  : {baseline['total_tokens_month']:,}",
        f"Compute profile       : {baseline['gpu_type']} / ~{baseline['est_gpu_hours_month']} GPU-hours",
        f"Est. monthly cost     : ${baseline['est_monthly_cost_low_usd']:,} - ${baseline['est_monthly_cost_high_usd']:,}",
    ]:
        pdf.cell(0, 6, line, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 9, "2. Failure Analysis", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10.5)
    pdf.multi_cell(0, 5.5, analysis)
    pdf.ln(4)

    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(0, 9, "3. NFH Target Architecture", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10.5)
    pdf.multi_cell(0, 5.5, recommendation)
    pdf.ln(6)

    pdf.set_draw_color(*ORANGE)
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())
    pdf.ln(4)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(*MUTED)
    pdf.multi_cell(0, 5, "Estimates are planning figures, not benchmarks. Ready to build this? Book an architecture review: cal.com/neural-forge-hub")
    return bytes(pdf.output())
