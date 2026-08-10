import React from "react";
import BrutalistCard from "@/components/cards/BrutalistCard";
import { Terminal, Lock, Globe, Server, Activity } from "lucide-react";
import SystemTelemetryFallback from "./SystemTelemetryFallback";
import { getEcosystemData, getPostsData } from "@/app/actions/adminActions";

async function getSwarmTelemetry() {
  const projects = await getPostsData();
  
  // Priority 1: Health Endpoint (The Live Project API)
  for (const project of projects) {
    if (project.healthEndpoint) {
      try {
        const start = Date.now();
        const res = await fetch(project.healthEndpoint, { next: { revalidate: 300 } });
        const latency = Date.now() - start;
        if (res.ok) {
          const contentType = res.headers.get('content-type');
          let snippet = "";
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            snippet = JSON.stringify(data).substring(0, 100);
          } else {
            snippet = (await res.text()).substring(0, 100);
          }
          return { type: 'api', project: project.title, status: res.status, latency, snippet };
        }
      } catch (err) {
        // Silently fail and cascade
      }
    }
  }

  // Priority 2: GitHub Actions CI/CD (The Real-World Proof)
  for (const project of projects) {
    if (project.githubRepo) {
      try {
        const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/actions/runs?per_page=3`, {
          next: { revalidate: 60 }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.workflow_runs && data.workflow_runs.length > 0) {
            return { type: 'cicd', project: project.title, runs: data.workflow_runs };
          }
        }
      } catch (err) {
        // Silently fail and cascade
      }
    }
  }

  // Priority 3: Fallback (Node Telemetry)
  return { type: 'fallback' };
}

export default async function AgentEcosystem() {
  const agents = await getEcosystemData();
  const telemetry = await getSwarmTelemetry();

  const getIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "lock": return <Lock className="w-6 h-6 currentColor" />;
      case "globe": return <Globe className="w-6 h-6 currentColor" />;
      default: return <Terminal className="w-6 h-6 currentColor" />;
    }
  };

  return (
    <section id="agents" className="relative w-full py-32 bg-[#f0f0f0] border-b border-black">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-16 border-b border-black pb-8">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">SWARM INTELLIGENCE</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase max-w-3xl leading-[0.9]">
            AUTONOMOUS AGENT ECOSYSTEM.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((item: any, idx: number) => (
            <div key={idx}>
              <BrutalistCard className="h-full flex flex-col gap-6" whiteBg>
                <div className={`w-14 h-14 flex items-center justify-center ${item.accent}`}>
                  {getIcon(item.icon)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black uppercase mb-3">{item.title}</h3>
                  <p className="font-mono text-sm text-black/70 leading-relaxed border-l-2 border-black/20 pl-3">
                    {item.desc}
                  </p>
                </div>
              </BrutalistCard>
            </div>
          ))}
        </div>

        {/* SWARM TELEMETRY EXPANSION (Cascading Architecture) */}
        <div className="mt-16 bg-[#111111] border-4 border-black p-1 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col md:flex-row h-[350px]">
          
          {telemetry.type === 'api' && (
            <div className="flex-1 border-r-2 border-black/30 p-6 flex flex-col font-mono relative z-10 bg-black/40">
              <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                <div className="w-3 h-3 bg-[#00ff41] animate-pulse" />
                <span className="text-white text-sm font-bold tracking-widest uppercase">LIVE API TELEMETRY</span>
              </div>
              <div className="flex flex-col gap-4 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">TARGET:</span>
                  <span className="text-white font-bold">{telemetry.project}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">STATUS:</span>
                  <span className="text-[#00ff41]">{telemetry.status} OK</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/50">LATENCY:</span>
                  <span className="text-white">{telemetry.latency}ms</span>
                </div>
                <div className="flex flex-col pb-2">
                  <span className="text-white/50 mb-2">RESPONSE_PAYLOAD:</span>
                  <span className="text-white text-[10px] bg-black/50 p-2 break-all">{telemetry.snippet}</span>
                </div>
              </div>
            </div>
          )}

          {telemetry.type === 'cicd' && (
            <div className="flex-1 border-r-2 border-black/30 p-6 flex flex-col font-mono relative z-10 bg-black/40 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
                <div className="w-3 h-3 bg-[#00f0ff] animate-pulse" />
                <span className="text-white text-sm font-bold tracking-widest uppercase">CI/CD PIPELINE STATUS</span>
              </div>
              <div className="mb-4 text-xs font-bold text-white/70 uppercase">TARGET: {telemetry.project}</div>
              <div className="flex flex-col gap-3">
                {telemetry.runs.map((run: any, idx: number) => (
                  <div key={idx} className="border border-white/10 p-3 flex flex-col gap-2 hover:bg-white/5 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[#00f0ff] text-[10px] uppercase font-bold">{run.name}</span>
                      <span className={`text-[9px] uppercase px-2 py-0.5 ${run.status === 'completed' && run.conclusion === 'success' ? 'bg-[#00ff41]/20 text-[#00ff41]' : run.status === 'in_progress' ? 'bg-[#ff6b00]/20 text-[#ff6b00] animate-pulse' : 'bg-red-500/20 text-red-500'}`}>
                        {run.status === 'completed' ? run.conclusion : run.status}
                      </span>
                    </div>
                    <div className="text-white/60 text-[9px] truncate">Branch: {run.head_branch}</div>
                    <div className="text-white text-[10px] truncate">{run.head_commit?.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {telemetry.type === 'fallback' && (
            <SystemTelemetryFallback />
          )}

          {/* RIGHT: Agent Status Grid */}
          <div className="w-full md:w-96 p-6 flex flex-col bg-[#111111] z-10 border-l-2 border-black/30">
            <h4 className="text-white text-xs font-mono font-bold tracking-widest uppercase mb-6 opacity-70 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff6b00]" /> ACTIVE INFRASTRUCTURE
            </h4>
            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { name: "Frontend_Edge", load: "ACTIVE", status: "active", icon: <Globe className="w-3 h-3"/> },
                { name: "Backend_API", load: "SYNCED", status: "idle", icon: <Server className="w-3 h-3"/> },
                { name: "Auth_Gateway", load: "SECURE", status: "active", icon: <Lock className="w-3 h-3"/> },
                { name: "Cron_Scheduler", load: "IDLE", status: "idle", icon: <Terminal className="w-3 h-3"/> },
              ].map((agent, i) => (
                <div key={i} className="border border-white/20 p-3 flex flex-col justify-between hover:bg-white/5 transition-colors cursor-crosshair">
                  <div className="text-[#00f0ff] font-mono text-[10px] truncate mb-2 flex items-center gap-1">
                    {agent.icon} {agent.name}
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-white font-black text-sm">{agent.load}</span>
                    <div className={`w-2 h-2 ${agent.status === 'active' ? 'bg-[#ff6b00] animate-pulse' : 'bg-white/30'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 opacity-10" 
               style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />
        </div>

      </div>
    </section>
  );
}