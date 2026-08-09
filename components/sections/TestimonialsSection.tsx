"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Elena Rostova",
    role: "CTO, Vanguard Data",
    content: "Integrating Neural Forge into our data pipeline reduced our inference latency by 40%. The brutalist simplicity of the API hides an incredibly robust and scalable infrastructure underneath. It has completely transformed our deployment strategy.",
    initials: "ER"
  },
  {
    name: "Marcus Webb",
    role: "Lead Engineer, Synthetix",
    content: "The swarm intelligence architecture is unlike anything we've worked with. The autonomous agents handle our smart contract auditing flawlessly. We went from manually reviewing edge cases for weeks to letting the swarm handle it in hours.",
    initials: "MW"
  },
  {
    name: "Dr. Sarah Chen",
    role: "Head of AI, Nexus Corp",
    content: "We demanded an air-gapped, highly secure inference cluster. Neural Forge delivered exactly that. Their GPU compute nodes are ridiculously fast, and the dashboard gives us total transparency into the network's health.",
    initials: "SC"
  },
  {
    name: "Julian Vance",
    role: "Founder, Horizon Labs",
    content: "I was skeptical of the brutalist approach at first, but it just works. No bloated UI, no confusing telemetry. Just raw, unadulterated performance. It's the most reliable infrastructure we've ever built upon.",
    initials: "JV"
  },
  {
    name: "Viktor Drazen",
    role: "CEO, Cyberdyne Logistics",
    content: "The web intelligence agents completely automated our global supply chain scraping. What used to take a team of 15 data scientists now happens autonomously in real-time.",
    initials: "VD"
  },
  {
    name: "Amara Singh",
    role: "VP Engineering, Quantum Finance",
    content: "We switched to Neural Forge for our high-frequency trading models. The absolute bare-metal speed and strict zero-telemetry policy made it a no-brainer. Incredible architecture.",
    initials: "AS"
  }
];

export default function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full bg-[#e5e5e5] border-t-2 border-black py-24 z-10 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end gap-12 mb-16 border-b-2 border-black pb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">REVIEWS</span>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-[0.9]">
              TESTIMONIALS
            </h2>
          </div>
          
          <div className="flex items-center gap-6 border-l-4 border-black pl-6 mt-6 md:mt-0">
            <Quote className="w-8 h-8 text-black/20" />
            <p className="font-mono text-sm text-black/70 max-w-xs font-bold">
              Don't take our word for it. Trusted by industry leaders building next-generation architecture.
            </p>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-end gap-4 mb-8">
          <button onClick={scrollLeft} className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={scrollRight} className="w-12 h-12 border-2 border-black bg-[#ff6b00] text-white flex items-center justify-center hover:bg-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Cards Container */}
        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 w-full"
        >
          {TESTIMONIALS.map((test, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[85vw] md:min-w-[500px] snap-start bg-white border-2 border-black flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
            >
              {/* Card Header (Profile) */}
              <div className="flex items-center gap-6 p-6 border-b-2 border-black bg-[#f8f8f8]">
                <div className="w-16 h-16 bg-black flex items-center justify-center text-white font-black text-xl">
                  {test.initials}
                </div>
                <div>
                  <h4 className="font-black text-2xl uppercase text-black">{test.name}</h4>
                  <p className="font-mono text-xs uppercase tracking-widest text-black/60 font-bold">{test.role}</p>
                </div>
              </div>
              
              {/* Card Body */}
              <div className="flex flex-1">
                <div className="p-8 flex-1 font-mono text-sm leading-relaxed text-black/80 font-bold max-w-sm">
                  "{test.content}"
                </div>
                {/* Right vertical bar graphic */}
                <div className="w-16 border-l-2 border-black bg-black flex flex-col items-center justify-center text-white/50 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 20px)' }} />
                  <span className="font-mono text-xs -rotate-90 whitespace-nowrap tracking-widest font-black uppercase relative z-10 text-white">Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
