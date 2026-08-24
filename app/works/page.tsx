// app/works/page.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { verifiedProjects, Project } from "@/lib/projects";

export default function WorksPage() {
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <main className="min-h-screen bg-[#e5e5e5] text-black pt-20">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-10">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-black pb-8">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-[#ff6b00] uppercase mb-4">
              {"// ARCHIVE_INDEX"}
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              Selected <span className="text-[#ff6b00]">Architecture</span>
            </h1>
          </div>
          <p className="font-mono text-xs text-black/60 font-bold">
            12 SYSTEMS // VERIFIED BUILDS // NO VAPORWARE
          </p>
        </div>
        <p className="mt-8 max-w-2xl text-black/80 leading-relaxed font-bold">
          A verified catalog of production-grade systems, autonomous agents, and
          high-throughput platforms. No conceptual mockups. Only deployed
          engineering. Click any system to open its full architecture breakdown.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {verifiedProjects.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSelected(p)}
              className="group text-left bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_#ff6b00] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-200 overflow-hidden"
            >
              {/* Image plate — dark editorial print framed in brutalist card */}
              <div className="relative w-full aspect-[16/9] border-b border-black bg-black overflow-hidden">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}
                <span className="absolute top-3 left-4 font-mono text-xs text-[#ff6b00] bg-black px-2 py-1 border border-[#ff6b00]/30 font-bold">
                  {p.index}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-2xl font-black tracking-tight">{p.title}</h2>
                  <span className="font-mono text-xs font-bold whitespace-nowrap mt-2 group-hover:text-[#ff6b00] transition-colors">
                    OPEN +
                  </span>
                </div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 mb-3">
                  {p.category}
                </p>
                <p className="text-sm leading-relaxed text-black/80 mb-5 font-medium">{p.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {p.stack.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-black text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

/* ============ MODAL (seamless popup, no route change) ============ */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#f0f0f0] border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl max-h-[88vh] overflow-y-auto">
        {/* Sticky top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-[#f0f0f0] border-b border-black px-6 py-4">
          <p className="font-mono text-xs text-[#ff6b00] font-bold uppercase tracking-widest">
            {project.index} {"//"} {project.category}
          </p>
          <button
            onClick={onClose}
            autoFocus
            className="font-mono text-xs font-bold border border-black bg-white px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff6b00] hover:text-white transition-colors"
          >
            CLOSE ✕
          </button>
        </div>

        <div className="p-6 md:p-10">
          {/* Title block */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4">{project.title}</h2>
          <p className="text-base md:text-lg text-black/80 font-medium leading-relaxed mb-8">{project.summary}</p>

          {/* Hero image */}
          <div className="relative w-full aspect-[16/9] border border-black bg-black mb-10">
            {project.image && (
              <Image src={project.image} alt={project.title} fill sizes="100vw" className="object-cover" />
            )}
          </div>

          {/* Problem / Response */}
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div className="border border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff6b00] mb-3">The Problem</h3>
              <p className="text-sm font-medium leading-relaxed text-black/90">{project.problem}</p>
            </div>
            <div className="border border-black bg-white p-6 shadow-[4px_4px_0px_0px_#ff6b00]">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff6b00] mb-3">The Engineering Response</h3>
              <p className="text-sm font-medium leading-relaxed text-black/90">{project.solution}</p>
            </div>
          </div>

          {/* Architecture */}
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-5">
            System Architecture
          </h3>
          <ul className="grid md:grid-cols-2 gap-3 mb-10">
            {project.architecture.map((a) => (
              <li key={a} className="flex gap-3 text-sm font-medium text-black/90 leading-relaxed border border-black bg-white px-4 py-3">
                <span className="text-[#ff6b00] font-mono font-bold">▸</span>
                {a}
              </li>
            ))}
          </ul>

          {/* Highlights */}
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-5">
            Key Highlights
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {project.highlights.map((h, i) => (
              <div key={h.title}>
                <p className="font-mono text-xs font-bold text-[#ff6b00] mb-2">{`0${i + 1}`}</p>
                <h4 className="font-black tracking-tight mb-2">{h.title}</h4>
                <p className="text-sm text-black/80 font-medium leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>

          {/* Stack */}
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-black pb-2 mb-4">Stack</h3>
          <div className="flex flex-wrap gap-2 mb-10">
            {project.stack.map((t) => (
              <span key={t} className="px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider bg-black text-white">
                {t}
              </span>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-black pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-mono text-xs font-bold text-black/60">VERIFIED BUILD {"//"} NEURAL FORGE ARCHIVE</p>
            <a
              href="https://cal.com/neural-forge-hub"
              target="_blank"
              rel="noreferrer"
              className="bg-black text-white font-mono font-bold text-xs tracking-widest px-6 py-3 border border-black shadow-[4px_4px_0px_0px_#ff6b00] hover:bg-[#ff6b00] transition-colors"
            >
              BOOK STRATEGY CALL →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
