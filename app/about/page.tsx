"use client";

import React, { useState, useEffect, JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Mail, Github as GithubIcon, Linkedin as LinkedinIcon, Phone, Server, ShieldCheck, Zap, 
  Globe, Users, Cpu, ArrowRight, Database, Lock, Layers, BarChart3, Loader2
} from "lucide-react";

/* COMPONENTS */
import TopBrandHeader from "@/components/TopBrandHeader";
import SideNav from "@/components/SideNav";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";
import CircularWorkflow from "@/components/about/CircularWorkflow";
import VersatilityGraph from "@/components/about/VersatilityGraph";
import HubSpokeGraph from "@/components/about/HubSpokeGraph";

export default function AboutPage(): JSX.Element {
  const router = useRouter();
  const [founders, setFounders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/data/aboutContent.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setFounders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading founders data:", err);
        setIsLoading(false);
      });
  }, []);

  return (
      <main className="relative min-h-screen bg-transparent text-[#E5E4E2] selection:bg-[#FFD700]/30 overflow-x-hidden">

        {/* BACKGROUND LAYER */}
        <SmokeBackground />

        <div className="relative z-10">
          <TopBrandHeader />
      <SideNav />
          <OrbitChat />

          {/* SUBTLE OVERLAY GRID */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-150 md:h-150 bg-[#FFD700]/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"
            />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 px-4 py-1 border border-[#FFD700]/30 bg-[#FFD700]/5 rounded-full backdrop-blur-md">
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-[#FFD700]">Global IT Delivery Organization</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.9] font-serif text-white">
              Architecting <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Digital Power.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 max-w-2xl text-[#E5E4E2]/80 font-light text-base md:text-xl leading-relaxed mx-auto px-4 font-sans">
              A high-performance engineering powerhouse deploying elite multi-domain squads to solve complex technological challenges.
            </motion.p>
          </section>

          {/* 2. IDENTITY // THE IT FARM */}
          <section className="max-w-7xl mx-auto px-6 py-10 md:py-20">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-[#FFD700] font-mono text-xs uppercase tracking-[0.4em] mb-4">Identity // Core</h2>
                <h3 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-white font-serif">The IT Farm.</h3>
                <p className="text-[#E5E4E2]/80 text-lg font-light leading-relaxed mb-8">
                  We are a specialized infrastructure designed for the centralized leadership of decentralized elite engineering squads. 
                </p>
                
                <HubSpokeGraph />
              </motion.div>

              <AnimatedBorderCard>
                <div className="space-y-8">
                  {[
                    { icon: Server, title: "Central Governance", desc: "Strategic management from our primary operations hub." },
                    { icon: Users, title: "Elite Squads", desc: "Hand-picked task forces for domain-specific execution." },
                    { icon: Zap, title: "High-Velocity", desc: "Rapid resource allocation to match enterprise pace." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="p-3 bg-[#FFD700]/5 border border-[#FFD700]/10 rounded-2xl shrink-0 h-fit"><item.icon className="w-5 h-5 text-[#FFD700]" /></div>
                      <div>
                        <h4 className="font-bold text-white text-base">{item.title}</h4>
                        <p className="text-[#E5E4E2]/60 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedBorderCard>
            </div>
          </section>

          {/* 3. EXECUTION LOGIC */}
          <section className="px-6 py-10 md:py-20">
            <CircularWorkflow />
          </section>

          {/* 4. DOMAIN EXPERTISE & CAPABILITY */}
          <section className="py-10 md:py-20 bg-[#020202]/50 border-y border-white/5 backdrop-blur-xl relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <VersatilityGraph />
          </section>

          {/* 6. FOUNDERS (DYNAMIC CMS) */}
          <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-serif text-white">The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Commanders.</span></h2>
            </div>
            
            {isLoading ? (
               <div className="flex justify-center items-center py-20">
                 <Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" />
               </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                {founders.map((founder, idx) => (
                  <FounderCard
                    key={idx}
                    name={founder.name}
                    role={founder.role}
                    email="team.techserve55@gmail.com"
                    phone="Restricted Access"
                    githubUrl="#"
                    linkedinUrl="#"
                    imageSrc={founder.image || "/founders/placeholder.png"}
                    description={founder.description}
                  />
                ))}
              </div>
            )}
          </section>

          {/* 7. CTA */}
          <section className="max-w-7xl mx-auto px-6 pb-20 mt-10">
            <motion.div whileHover={{ scale: 1.01 }} className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 overflow-hidden border border-white/10 bg-[#020202]/40 backdrop-blur-3xl text-center group">
               <div className="absolute inset-0 bg-[#FFD700]/5 group-hover:bg-[#FFD700]/10 transition-colors" />
               <h2 className="relative text-3xl md:text-7xl font-black italic uppercase tracking-tighter mb-10 leading-tight font-serif text-white">Ready to Deploy Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Elite Squad?</span></h2>
               <Link href="/services">
                 <button 
                 className="relative px-12 py-6 bg-white text-[#0a0e27] rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 mx-auto group active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.2)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all">
                   Start Build <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-[#0a0e27]" />
                 </button>
               </Link>
            </motion.div>
          </section>

          <footer className="py-10 text-center border-t border-white/5 text-[9px] font-mono text-[#E5E4E2]/40 uppercase tracking-widest">
            © 2026 IT FARM GLOBAL DELIVERY NETWORK.
          </footer>
        </div>

        <style jsx global>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          .animate-shimmer {
            animation: shimmer 6s linear infinite;
          }
          @keyframes border-glow {
            0%, 100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.2); border-color: rgba(255, 215, 0, 0.3); }
            50% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); border-color: rgba(255, 255, 255, 0.8); }
          }
          .glow-border {
            animation: border-glow 3s ease-in-out infinite;
          }
        `}</style>
      </main>
  );
}

/* SUB-COMPONENTS */

function AnimatedBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-4xl p-[1px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,215,0,0.3),transparent)] bg-size-[200%_100%] animate-shimmer" />
      <div className="relative bg-[#0a0e27]/90 border border-white/10 rounded-4xl p-8 md:p-12 backdrop-blur-2xl">
        {children}
      </div>
    </motion.div>
  );
}

interface FounderCardProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  description: string;
  imageSrc: string;
  githubUrl: string;
  linkedinUrl: string;
}

function FounderCard({ name, role, email, phone, description, imageSrc, githubUrl, linkedinUrl }: FounderCardProps) {
  return (
    <AnimatedBorderCard>
      <div className="flex items-center gap-5 mb-6">
        <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full glow-border border-2 overflow-hidden bg-white/10 p-0.5">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-cover rounded-full transition-transform duration-500 hover:scale-110" 
          />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">{name}</h3>
          <p className="text-[#FFD700] text-[10px] font-mono uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <p className="text-[#E5E4E2]/80 text-sm font-light italic mb-8 h-14">&quot;{description}&quot;</p>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
        <div className="flex flex-col gap-2 w-full">
          <a href={`mailto:${email}`} className="text-[10px] md:text-[11px] font-mono text-[#E5E4E2]/50 hover:text-white flex items-center gap-2"><Mail className="w-3 h-3" /> {email}</a>
        </div>
        <div className="flex gap-4">
          <a href={githubUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-[#FFD700]/20 transition-colors"><GithubIcon className="w-5 h-5 text-[#E5E4E2]/50 hover:text-[#FFD700]" /></a>
          <a href={linkedinUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-[#FFD700]/20 transition-colors"><LinkedinIcon className="w-5 h-5 text-[#E5E4E2]/50 hover:text-[#FFD700]" /></a>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}