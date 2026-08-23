"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_FORECAST_API_URL || "http://localhost:8000";

interface Baseline {
  monthly_requests: number;
  total_tokens_month: number;
  gpu_type: string;
  est_gpu_hours_month: number | null;
  est_monthly_cost_low_usd: number;
  est_monthly_cost_high_usd: number;
}
interface ForecastResult {
  baseline: Baseline;
  cost_analysis: string;
  recommendation: string;
  delivered_to: string;
}

const inputCls =
  "w-full bg-[#0B0D0F] border border-white/10 rounded-md px-3 py-2.5 text-sm text-[#F5F5F5] placeholder-[#66707A] focus:outline-none focus:border-[#FF6A00]/60 transition-colors";
const labelCls = "block text-[11px] font-mono uppercase tracking-widest text-[#66707A] mb-1.5";

export default function ForecastWidget() {
  const [form, setForm] = useState({
    company_name: "", work_email: "", expected_mau: 10000,
    requests_per_user_month: 20, tokens_per_request: 800,
    model_tier: "small (7B-9B)", current_infrastructure: "Vercel serverless",
  });
  const [result, setResult] = useState<ForecastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/forecast/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).detail || "Generation failed");
      setResult(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="forecast" className="w-full bg-[#050505] py-24 px-6">
      <div className="max-w-6xl mx-auto">
      <p className="font-mono text-[11px] tracking-widest text-[#FF6A00] uppercase mb-3">
        Free Engineering Tool
      </p>
      <h2 className="text-3xl md:text-4xl font-semibold text-[#F5F5F5] tracking-tight mb-2">
        AI Inference Cost Forecaster
      </h2>
      <p className="text-[#66707A] max-w-2xl mb-10">
        Input your projected load. Our engineering swarm computes a deterministic infrastructure
        baseline and drafts your target architecture. Full PDF blueprint delivered to your inbox.
      </p>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* INPUT PANEL */}
        <form onSubmit={submit} className="bg-[#0B0D0F] border border-white/10 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Company</label>
              <input className={inputCls} required value={form.company_name}
                onChange={(e) => set("company_name", e.target.value)} placeholder="Acme AI" /></div>
            <div><label className={labelCls}>Work Email</label>
              <input className={inputCls} type="email" required value={form.work_email}
                onChange={(e) => set("work_email", e.target.value)} placeholder="you@company.com" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className={labelCls}>Expected MAU</label>
              <input className={inputCls} type="number" min={1} value={form.expected_mau}
                onChange={(e) => set("expected_mau", Number(e.target.value))} /></div>
            <div><label className={labelCls}>Req / User / Mo</label>
              <input className={inputCls} type="number" min={1} value={form.requests_per_user_month}
                onChange={(e) => set("requests_per_user_month", Number(e.target.value))} /></div>
            <div><label className={labelCls}>Tokens / Req</label>
              <input className={inputCls} type="number" min={1} value={form.tokens_per_request}
                onChange={(e) => set("tokens_per_request", Number(e.target.value))} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Model Tier</label>
              <select className={inputCls} value={form.model_tier}
                onChange={(e) => set("model_tier", e.target.value)}>
                {["small (7B-9B)", "mid (13B-34B)", "large (70B+)", "frontier-api"].map((m) => (
                  <option key={m} value={m}>{m}</option>))}
              </select></div>
            <div><label className={labelCls}>Current Infra</label>
              <select className={inputCls} value={form.current_infrastructure}
                onChange={(e) => set("current_infrastructure", e.target.value)}>
                {["Vercel serverless", "AWS EC2", "GCP GKE", "On-prem", "Other"].map((m) => (
                  <option key={m} value={m}>{m}</option>))}
              </select></div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#FF6A00] hover:bg-[#e05e00] disabled:opacity-50 text-[#050505] font-semibold text-sm tracking-wide rounded-md py-3 transition-colors">
            {loading ? "RUNNING ENGINEERING SWARM..." : "GENERATE MY BLUEPRINT →"}
          </button>
          <p className="text-[10px] font-mono text-[#66707A]">
            Used only to deliver your blueprint. No spam. No sharing.
          </p>
          {error && <p className="text-xs text-[#FF6A00] font-mono">ERROR: {error}</p>}
        </form>

        {/* RESULT PANEL */}
        <div className="bg-[#0B0D0F] border border-white/10 rounded-xl p-6 min-h-[420px]">
          {!result && !loading && (
            <div className="h-full flex items-center justify-center text-[#66707A] font-mono text-xs">
              AWAITING INPUT // BASELINE ENGINE IDLE
            </div>
          )}
          {loading && (
            <div className="h-full flex items-center justify-center text-[#FF6A00] font-mono text-xs animate-pulse">
              COMPUTING DETERMINISTIC BASELINE...
            </div>
          )}
          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["MONTHLY REQUESTS", result.baseline.monthly_requests.toLocaleString("en-US")],
                  ["TOKENS / MONTH", result.baseline.total_tokens_month.toLocaleString("en-US")],
                  ["COMPUTE PROFILE", `${result.baseline.gpu_type}${result.baseline.est_gpu_hours_month ? ` / ~${result.baseline.est_gpu_hours_month}h` : ""}`],
                  ["EST. COST / MO", `$${result.baseline.est_monthly_cost_low_usd.toLocaleString("en-US")} - $${result.baseline.est_monthly_cost_high_usd.toLocaleString("en-US")}`],
                ].map(([k, v]) => (
                  <div key={k} className="border border-white/10 rounded-md p-3">
                    <p className="text-[10px] font-mono text-[#66707A] tracking-widest mb-1">{k}</p>
                    <p className="text-sm font-mono text-[#FF6A00]">{v}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#66707A] tracking-widest mb-2">FAILURE ANALYSIS</p>
                <p className="text-sm text-[#F5F5F5] leading-relaxed">{result.cost_analysis}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#66707A] tracking-widest mb-2">NFH TARGET ARCHITECTURE</p>
                <p className="text-sm text-[#F5F5F5] leading-relaxed">{result.recommendation}</p>
              </div>
              <p className="text-[11px] font-mono text-[#FF6A00]">
                PDF BLUEPRINT DELIVERED → {result.delivered_to}
              </p>
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}
