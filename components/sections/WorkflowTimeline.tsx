"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PHASES = [
  {
    id: "01",
    title: "Architecture & Feasibility (System Design)",
    description: "Before a single line of code is written, we map the entire technical lifecycle of the product to ensure it survives production.",
    bullets: [
      "The Audit: Technical Feasibility, Hardware Constraints.",
      "Architecture Mapping: Threat Modeling, Stack Selection, Database Schema.",
      "Security Perimeters: Ensuring zero data exfiltration."
    ]
  },
  {
    id: "02",
    title: "The Core Engine (Data & AI Logic)",
    description: "We build the \"brain\" of the application first, operating purely in the backend and terminal.",
    bullets: [
      "Data Ingestion: Vector Embeddings, Chunking, Labeling Datasets.",
      "Model Integration: Hyper-Parameter Tuning, System Prompts.",
      "Validation: Deterministic Output Validation, Hallucination-Free Operations."
    ]
  },
  {
    id: "03",
    title: "The Application Layer (UI/UX & API)",
    description: "Once the intelligence is stable, we build the \"body\" to make it usable for non-technical end-users.",
    bullets: [
      "Endpoint Generation: Secure Endpoint Generation, REST APIs, WebSockets.",
      "Frontend Development: Cross-Platform UI, Web Dashboard, Mobile Interface.",
      "State & Streaming: Real-Time Token Streaming, Error Handling."
    ]
  },
  {
    id: "04",
    title: "CI/CD & Production Launch (Deployment)",
    description: "We transition the software from a local build to a globally available, highly reliable product.",
    bullets: [
      "Pipeline Setup: CI/CD Pipeline Automation, GitHub Actions.",
      "Infrastructure Provisioning: Edge Provisioning, Private GPU Clusters.",
      "Telemetry & Handoff: Live Telemetry, Plausible Analytics, Delivery."
    ]
  }
];

export default function WorkflowTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="relative ml-4 md:ml-8 py-8">
      {/* Background track line */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-black/10 z-0" />
      
      {/* Animated active line */}
      <motion.div 
        className="absolute top-0 left-0 w-1 bg-black z-0 origin-top"
        style={{ height: lineHeight }}
      />

      {PHASES.map((phase, idx) => (
        <motion.div 
          key={phase.id} 
          className="relative pl-8 md:pl-12 mb-16 last:mb-0 group"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.1, type: "tween", ease: "linear" }}
        >
          {/* Branching Line */}
          <div className="absolute top-4 left-0 w-8 h-1 bg-black z-0" />

          {/* Node Indicator */}
          <div className="absolute -left-[14px] top-0 w-8 h-8 bg-white border-4 border-black flex items-center justify-center font-black text-xs text-black group-hover:bg-[#ff6b00] group-hover:text-white transition-colors z-10">
            {phase.id}
          </div>
          
          {/* Content Card */}
          <div className="bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transition-all relative z-10">
            <h3 className="text-xl md:text-2xl font-black uppercase text-black mb-3 border-b-2 border-black pb-4 inline-block w-full">
              {phase.title}
            </h3>
            <p className="font-mono text-sm text-black/80 mb-6 italic border-l-2 border-[#ff6b00] pl-3">
              {phase.description}
            </p>
            <ul className="space-y-4">
              {phase.bullets.map((bullet, bIdx) => {
                const splitIndex = bullet.indexOf(': ');
                const boldPart = bullet.substring(0, splitIndex);
                const rest = bullet.substring(splitIndex + 2);
                
                return (
                  <li key={bIdx} className="flex items-start gap-3 font-mono text-xs md:text-sm text-black/70">
                    <span className="text-[#ff6b00] font-black mt-0.5">›</span>
                    <span>
                      <strong className="text-black">{boldPart}:</strong> {rest}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
