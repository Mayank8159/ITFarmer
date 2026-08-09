"use client";

import React, { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Github as GithubIcon, Linkedin as LinkedinIcon, ArrowRight, Loader2, Server, Users, Zap } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

export default function AboutPage(): JSX.Element {
  const [founders, setFounders] = useState<any[]>([]);
  const [aboutConfig, setAboutConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/data/aboutContent.json?t=' + Date.now()).then(res => res.json()),
      fetch('/data/aboutConfig.json?t=' + Date.now()).then(res => res.json())
    ]).then(([foundersData, configData]) => {
      setFounders(foundersData);
      setAboutConfig(configData);
      setIsLoading(false);
    }).catch(err => {
      console.error("Error loading about data:", err);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black overflow-x-hidden pt-28">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 pb-20">
        
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[60vh] flex flex-col items-start justify-center border-b border-black pb-16">
          <div className="border border-black px-3 py-1 mb-8 bg-white inline-flex items-center gap-2">
            <div className="w-2 h-2 bg-[#ff6b00]" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-black font-bold">RESEARCH DIVISION</span>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.9] text-black"
          >
            ARCHITECTING <br /> <span className="text-[#ff6b00]">DIGITAL POWER.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="mt-8 max-w-3xl text-black/70 font-mono text-lg leading-relaxed border-l-4 border-black pl-6 bg-white p-6 border-r border-y shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            A high-performance engineering powerhouse deploying elite multi-domain squads to solve complex technological challenges. We are a specialized infrastructure designed for the centralized leadership of decentralized elite engineering squads.
          </motion.p>
        </section>

        {/* 2. CORE PILLARS */}
        <section className="py-20 border-b border-black">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
              Execution Logic
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {(!isLoading && aboutConfig?.executionLogic ? aboutConfig.executionLogic : []).map((item: any, i: number) => {
              let IconComponent = Server;
              if (item.icon === "Users") IconComponent = Users;
              if (item.icon === "Zap") IconComponent = Zap;

              return (
                <BrutalistCard key={i} whiteBg>
                  <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-black text-2xl text-black uppercase mb-3">{item.title}</h4>
                  <p className="text-black/70 font-mono text-sm leading-relaxed">{item.desc}</p>
                </BrutalistCard>
              );
            })}
          </div>
        </section>

        {/* 3. CAPABILITIES MATRIX */}
        <section className="py-20 border-b border-black">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
              Capabilities Matrix
            </h2>
            <p className="text-black/70 font-mono text-sm max-w-2xl">
              High-ticket agency services designed to attract enterprise clients and funded startups.
            </p>
          </div>
          
          <div className="flex flex-col border-4 border-black bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            {(!isLoading && aboutConfig?.capabilities ? aboutConfig.capabilities : []).map((cap: any, i: number) => {
              const bgs = ["bg-[#ff6b00]", "bg-[#f0f0f0]", "bg-[#f0f0f0]", "bg-[#f0f0f0]", "bg-[#f0f0f0]"];
              const hoverBgs = ["group-hover:bg-[#ff6b00]", "group-hover:bg-black", "group-hover:bg-black", "group-hover:bg-black", "group-hover:bg-black"];
              const hoverTexts = ["group-hover:translate-x-2", "group-hover:text-[#ff6b00] group-hover:translate-x-2", "group-hover:text-[#ff6b00] group-hover:translate-x-2", "group-hover:text-[#ff6b00] group-hover:translate-x-2", "group-hover:text-[#ff6b00] group-hover:translate-x-2"];
              const hoverPTexts = ["group-hover:text-white", "group-hover:text-white/80", "group-hover:text-white/80", "group-hover:text-white/80", "group-hover:text-white/80"];
              
              const isFirst = i === 0;
              const isLast = i === (aboutConfig?.capabilities?.length || 5) - 1;

              return (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-3 group hover:bg-black transition-colors cursor-crosshair ${!isLast ? 'border-b-4 border-black' : ''}`}>
                  <div className={`col-span-1 border-b md:border-b-0 md:border-r-4 border-black p-6 flex items-center ${bgs[i] || "bg-[#f0f0f0]"} ${hoverBgs[i] || "group-hover:bg-black"} transition-colors ${isFirst ? 'relative overflow-hidden' : ''}`}>
                    <h3 className={`font-black text-xl uppercase text-black ${hoverTexts[i] || "group-hover:text-[#ff6b00] group-hover:translate-x-2"} transition-all ${isFirst ? 'relative z-10' : ''}`}>
                      {cap.title}
                    </h3>
                  </div>
                  <div className="col-span-2 p-6 flex items-center bg-white group-hover:bg-black transition-colors">
                    <p className={`font-mono text-sm text-black/80 ${hoverPTexts[i] || "group-hover:text-white/80"} leading-relaxed font-bold transition-colors`}>
                      {cap.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. THE HORIZON PROTOCOL */}
        <section className="py-20 border-b border-black">
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-black">
              The Horizon Protocol
            </h2>
            <p className="text-black/70 font-mono text-sm max-w-2xl">
              Continuous innovation pipeline. What we are doing now, and what comes next.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-[45%] left-[20%] right-[20%] h-1 bg-black z-0 border-y border-white" />
            
            {(!isLoading && aboutConfig?.horizon ? aboutConfig.horizon : []).map((item: any, i: number) => {
              const bgs = ["bg-white", "bg-[#ff6b00]", "bg-[#f0f0f0]"];
              return (
                <div key={i} className={`relative z-10 ${bgs[i] || "bg-white"} border-2 border-black p-6 flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-transform`}>
                  <div className="bg-black text-white text-[10px] font-mono uppercase tracking-widest py-1 px-3 mb-4 w-fit font-bold">
                    {item.tag}
                  </div>
                  <h3 className="font-black text-xl uppercase text-black mb-3 border-b border-black pb-2">{item.title}</h3>
                  <p className="text-sm font-mono text-black/70 flex-1">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. FOUNDERS */}
        <section className="py-20 border-b border-black">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-[0.9]">
              THE <span className="text-[#ff6b00]">COMMANDERS.</span>
            </h2>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center items-center py-20 bg-white border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <Loader2 className="w-8 h-8 animate-spin text-black" />
             </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {founders.map((founder, idx) => (
                <BrutalistCard key={idx} whiteBg className="flex flex-col h-full group/founder">
                  <div className="flex items-center gap-6 mb-8 border-b border-black pb-6">
                    <div className="relative h-20 w-20 md:h-24 md:w-24 border-4 border-black bg-black overflow-hidden flex-shrink-0">
                      <Image 
                        src={founder.image || "/founders/placeholder.png"} 
                        alt={founder.name} 
                        fill 
                        className="object-cover object-top grayscale group-hover/founder:grayscale-0 transition-all duration-500" 
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-black uppercase leading-tight mb-2">{founder.name}</h3>
                      <p className="bg-[#ff6b00] text-white px-2 py-1 text-[10px] font-mono uppercase tracking-widest inline-block font-bold">
                        {founder.role}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-black/70 text-sm font-mono leading-relaxed mb-8 flex-1 border-l-2 border-black pl-4 bg-[#f0f0f0] p-4 italic">
                    "{founder.description}"
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black">
                    <div className="flex flex-col gap-2 w-full">
                      <a href={`mailto:${founder.email || 'team.techserve55@gmail.com'}`} className="text-[10px] font-mono font-bold text-black hover:text-[#ff6b00] flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {founder.email || 'team.techserve55@gmail.com'}
                      </a>
                    </div>
                    <div className="flex gap-4">
                      {founder.github && (
                        <a href={founder.github} target="_blank" rel="noopener noreferrer" className="p-2 border border-black hover:bg-black hover:text-white transition-colors bg-white">
                          <GithubIcon className="w-5 h-5" />
                        </a>
                      )}
                      {founder.linkedin && (
                        <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 border border-black hover:bg-black hover:text-white transition-colors bg-white">
                          <LinkedinIcon className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </BrutalistCard>
              ))}
            </div>
          )}
        </section>

        {/* 4. CTA */}
        <section className="py-20 flex justify-center">
          <div className="bg-white border-4 border-black p-12 text-center max-w-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
             <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] text-black">
               Deploy Your <br /> <span className="text-[#ff6b00]">Elite Squad.</span>
             </h2>
             <Link href="/services">
               <button className="px-10 py-5 bg-black text-white font-mono text-sm uppercase tracking-widest flex items-center gap-3 mx-auto hover:bg-[#ff6b00] transition-colors border-2 border-black font-bold group">
                 Start Build <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </button>
             </Link>
          </div>
        </section>

      </div>
    </main>
  );
}