"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { 
  Mail, Github as GithubIcon, Linkedin as LinkedinIcon, Phone, Server, ShieldCheck, Zap, 
  Globe, Users, Cpu, ArrowRight, Database, Lock, Layers, BarChart3
} from "lucide-react";

/* COMPONENTS */
import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

export default function AboutPage(): JSX.Element {
  const router = useRouter();

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <main className="relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">

        {/* BACKGROUND LAYER */}
        <SmokeBackground />

        <div className="relative z-10">
          <FloatingNavbar />
          <OrbitChat />

          {/* SUBTLE OVERLAY GRID */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

          {/* 1. HERO SECTION */}
          <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col items-center justify-center text-center px-4 pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-150 md:h-150 bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none"
            />
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 px-4 py-1 border border-blue-500/30 bg-blue-500/5 rounded-full backdrop-blur-md">
              <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400">Global IT Delivery Organization</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-4xl sm:text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.9]">
              Architecting <br /> <span className="text-zinc-500">Digital Power.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 max-w-2xl text-zinc-400 font-light text-base md:text-xl leading-relaxed mx-auto px-4">
              A high-performance engineering powerhouse deploying elite multi-domain squads to solve complex technological challenges.
            </motion.p>
          </section>

          {/* 2. IDENTITY // THE IT FARM */}
          <section className="max-w-7xl mx-auto px-6 py-16 md:py-32">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Identity // Core</h2>
                <h3 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">The IT Farm.</h3>
                <p className="text-zinc-400 text-lg font-light leading-relaxed mb-8">
                  We are a specialized infrastructure designed for the centralized leadership of decentralized elite engineering squads. 
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <h4 className="text-blue-500 font-bold text-xl mb-1">99.9%</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Stability Rate</p>
                  </div>
                  <div className="p-4 bg-white/5 border border-white/5 rounded-2xl">
                      <h4 className="text-blue-500 font-bold text-xl mb-1">Elite</h4>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Talent Density</p>
                  </div>
                </div>
              </motion.div>

              <AnimatedBorderCard>
                <div className="space-y-8">
                  {[
                    { icon: Server, title: "Central Governance", desc: "Strategic management from our primary operations hub." },
                    { icon: Users, title: "Elite Squads", desc: "Hand-picked task forces for domain-specific execution." },
                    { icon: Zap, title: "High-Velocity", desc: "Rapid resource allocation to match enterprise pace." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shrink-0 h-fit"><item.icon className="w-5 h-5 text-blue-500" /></div>
                      <div>
                        <h4 className="font-bold text-white text-base">{item.title}</h4>
                        <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedBorderCard>
            </div>
          </section>

          {/* 3. EXECUTION LOGIC */}
          <section className="max-w-7xl mx-auto px-6 py-20 md:py-40">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Workflow // Ops</h2>
                <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">Execution <br /> Logic.</h3>
                <p className="text-zinc-400 font-light leading-relaxed text-sm md:text-base">
                  A surgical, step-by-step pipeline designed for zero-latency delivery and industrial stability.
                </p>
              </div>
              
              <div className="lg:col-span-8 space-y-6 md:space-y-8 relative">
                <div className="absolute left-10 top-10 bottom-10 w-px bg-blue-500/20 hidden md:block" />

                {[
                  { step: "01", title: "Intake & Scoping", desc: "Detailed analysis of business logic, user personas, and technical constraints." },
                  { step: "02", title: "Architecture Design", desc: "Blueprint creation: schemas, cloud infrastructure, and detailed API documentation." },
                  { step: "03", title: "Squad Assembly", desc: "Allocating domain experts (AI, Web, DevOps) from our internal network." },
                  { step: "04", title: "Agile Execution", desc: "Sprint-based cycles with bi-weekly updates and real-time environment access." },
                  { step: "05", title: "Security Hardening", desc: "Penetration testing, encryption audits, and compliance checks (GDPR/SOC2)." },
                  { step: "06", title: "Scale Deployment", desc: "Seamless CI/CD orchestration to production with 24/7 reliability monitoring." }
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col md:flex-row gap-4 md:gap-8 p-6 md:p-10 border border-white/5 rounded-4xl hover:border-blue-500/40 hover:bg-white/2 transition-all backdrop-blur-sm"
                  >
                    <div className="relative z-10 w-12 h-12 rounded-full bg-zinc-950 border border-blue-500/50 flex items-center justify-center text-blue-500 font-mono font-bold shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{item.title}</h4>
                      <p className="text-zinc-500 text-sm md:text-base font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. DOMAIN EXPERTISE */}
          <section className="py-20 md:py-32">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-[10px] font-mono uppercase tracking-[0.4em] text-center mb-16 text-zinc-500">Global Expertise Units</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-4xl overflow-hidden">
                {[
                  { icon: Globe, label: "Web & SaaS" }, { icon: Cpu, label: "AI & ML" },
                  { icon: Phone, label: "Mobile" }, { icon: Server, label: "Cloud & DevOps" },
                  { icon: Database, label: "Enterprise" }, { icon: Layers, label: "UI/UX" },
                  { icon: Lock, label: "Cybersecurity" }, { icon: BarChart3, label: "Automation" }
                ].map((domain, i) => (
                  <div key={i} className="bg-black p-8 md:p-12 flex flex-col items-center justify-center text-center group hover:bg-zinc-950 transition-colors">
                    <domain.icon className="w-7 h-7 text-zinc-600 mb-4 group-hover:text-blue-500 transition-all transform group-hover:scale-110" />
                    <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">{domain.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. GOVERNANCE CARD */}
          <section className="max-w-6xl mx-auto px-6 py-20">
            <AnimatedBorderCard>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <ShieldCheck className="w-12 h-12 text-blue-500 mb-6" />
                  <h3 className="text-3xl md:text-4xl font-bold mb-6">Enterprise Governance.</h3>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-8">
                    We enforce a &quot;Compliance-First&quot; mindset. Every line of code passes through rigorous QA pipelines before deployment.
                  </p>
                  <div className="space-y-3">
                    {["Peer Code Reviews", "AES-256 Encryption", "IP Confidentiality"].map((text, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" /> {text}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Uptime", val: "99.9%" }, { label: "Security", val: "ZERO Breach" },
                    { label: "Support", val: "24/7" }, { label: "Standards", val: "ISO Grade" }
                  ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stat.val}</div>
                      <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedBorderCard>
          </section>

          {/* 6. FOUNDERS */}
          <section className="max-w-6xl mx-auto px-6 py-24 md:py-40">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">The <span className="text-zinc-500">Commanders.</span></h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 md:gap-10">
              <FounderCard
                name="Mayank Kumar Sharma"
                role="Co-Founder & Full-Stack"
                email="team.techserve55@gmail.com"
                phone="+918159842418"
                githubUrl="https://github.com/Mayank8159"
                linkedinUrl="https://www.linkedin.com/in/mayank-kumar-sharma-900318318/"
                imageSrc="/founders/Mayank.png"
                description="Lead Architect specializing in AI platform engineering and decentralized delivery systems."
              />
              <FounderCard
                name="Shreyan Mitra"
                role="Co-Founder & Software"
                email="team.techserve55@gmail.com"
                phone="+918240591893"
                githubUrl="https://github.com/MURPHIOP"
                linkedinUrl="https://www.linkedin.com/in/shreyan-mitra/"
                imageSrc="/founders/shreyan.jpeg"
                description="Chief Reliability Officer. Expert in high-performance backends and cloud orchestration."
              />
            </div>
          </section>

          {/* 7. CTA */}
          <section className="max-w-7xl mx-auto px-6 pb-32">
            <motion.div whileHover={{ scale: 1.01 }} className="relative rounded-[2.5rem] md:rounded-[3.5rem] p-12 md:p-24 overflow-hidden border border-white/10 bg-zinc-950/40 backdrop-blur-3xl text-center group">
               <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
               <h2 className="relative text-3xl md:text-7xl font-black italic uppercase tracking-tighter mb-10 leading-tight">Ready to Deploy Your <br /> <span className="text-blue-500">Elite Squad?</span></h2>
               <button 
               onClick={() => router.push('/services')} 
               className="relative px-12 py-6 bg-white text-black rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 mx-auto group active:scale-95 shadow-2xl">
                 Start Build <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
               </button>
            </motion.div>
          </section>

          <footer className="py-10 text-center border-t border-white/5 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
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
            0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); border-color: rgba(59, 130, 246, 0.5); }
            50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.8); border-color: rgba(255, 255, 255, 0.8); }
          }
          .glow-border {
            animation: border-glow 3s ease-in-out infinite;
          }
        `}</style>
      </main>
    </ReactLenis>
  );
}

/* SUB-COMPONENTS */

function AnimatedBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative rounded-4xl p-[1.5px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(59,130,246,0.3),transparent)] bg-size-[200%_100%] animate-shimmer" />
      <div className="relative bg-zinc-950/80 border border-white/10 rounded-4xl p-8 md:p-12 backdrop-blur-2xl">
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
        {/* UPDATED: Profile Image with Glow Border and no grayscale */}
        <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-full glow-border border-2 overflow-hidden bg-white/10 p-0.5">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-cover rounded-full transition-transform duration-500 hover:scale-110" 
          />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold">{name}</h3>
          <p className="text-blue-500 text-[10px] font-mono uppercase tracking-widest">{role}</p>
        </div>
      </div>
      <p className="text-zinc-400 text-sm font-light italic mb-8 h-14">&quot;{description}&quot;</p>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
        <div className="flex flex-col gap-2 w-full">
          <a href={`mailto:${email}`} className="text-[10px] md:text-[11px] font-mono text-zinc-500 hover:text-white flex items-center gap-2"><Mail className="w-3 h-3" /> {email}</a>
          <a href={`tel:${phone}`} className="w-fit px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-blue-400 flex items-center gap-2"><Phone className="w-3 h-3" /> Direct Line</a>
        </div>
        <div className="flex gap-4">
          <a href={githubUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><GithubIcon className="w-5 h-5 text-zinc-500 hover:text-white" /></a>
          <a href={linkedinUrl} target="_blank" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"><LinkedinIcon className="w-5 h-5 text-zinc-500 hover:text-white" /></a>
        </div>
      </div>
    </AnimatedBorderCard>
  );
}