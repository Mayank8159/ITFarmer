import React from 'react';
import Link from 'next/link';
import { BrainCircuit, Cpu, Code2, Smartphone, ArrowRight } from 'lucide-react';
import BrutalistCard from '@/components/cards/BrutalistCard';

const SERVICES = [
  {
    id: "01",
    title: "AI/ML Engineering",
    outcome: "Transformers, RAG pipelines, computer vision, text encoders, and model fine-tuning.",
    icon: <BrainCircuit className="w-8 h-8 text-[#ff6b00]" />
  },
  {
    id: "02",
    title: "AI Agents & Automation",
    outcome: "Agent orchestration, AI workflow integration, and open-source model integration.",
    icon: <Cpu className="w-8 h-8 text-[#ff6b00]" />
  },
  {
    id: "03",
    title: "Web Applications",
    outcome: "Full-stack development, Next.js architecture, CI/CD, and robust maintenance.",
    icon: <Code2 className="w-8 h-8 text-[#ff6b00]" />
  },
  {
    id: "04",
    title: "Apps & Software",
    outcome: "Android, Windows (.exe), cross-platform deployment, and proper system design.",
    icon: <Smartphone className="w-8 h-8 text-[#ff6b00]" />
  }
];

export default function CapabilitiesSection() {
  return (
    <section className="relative w-full py-32 bg-[#e5e5e5] text-black border-b-4 border-black z-10">
      <div className="absolute inset-0 grid-background opacity-50 pointer-events-none z-0" />
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="mb-16 border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <div className="bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-4">
              OUR CORE COMPETENCIES
            </div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              ENGINEERING <br /><span className="text-[#ff6b00]">CAPABILITIES.</span>
            </h2>
          </div>
          <p className="font-mono text-sm text-black/70 max-w-xs border-l-2 border-[#ff6b00] pl-4">
            We build production AI and software systems, not prototypes. This is what we forge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {SERVICES.map((service, idx) => (
            <div key={service.id} className="h-full flex flex-col">
              <BrutalistCard whiteBg className="h-full flex flex-col p-8 hover:-translate-y-2 transition-transform duration-300">
                <div className="mb-6 flex justify-between items-start">
                  <div className="w-16 h-16 bg-[#f5f5f5] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {service.icon}
                  </div>
                  <span className="font-mono text-xl font-black text-black/20">{service.id}</span>
                </div>
                
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4 leading-none">{service.title}</h3>
                
                <p className="font-mono text-sm text-black/70 mb-8 flex-1">
                  {service.outcome}
                </p>

                <Link href="/work" className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff6b00] flex items-center gap-2 hover:text-black transition-colors group">
                  View Case Studies <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </BrutalistCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
