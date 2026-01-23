"use client";

import React, { JSX } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Mail, 
  Github, 
  Linkedin, 
  Phone, 
  Server, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Users, 
  Cpu, 
  ArrowRight,
  Database,
  Lock,
  Layers,
  BarChart3
} from "lucide-react";

/* COMPONENTS */
import FloatingNavbar from "@/components/Navbar";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";

/**
 * ABOUT PAGE - UPGRADED ENTERPRISE EDITION
 * Cinematic scrolling experience for a global IT delivery organization.
 */
export default function AboutPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      
      {/* BACKGROUND LAYER */}
      <SmokeBackground />

      {/* UI LAYER */}
      <div className="relative z-10">
        <FloatingNavbar />
        <OrbitChat />

        {/* SUBTLE OVERLAY GRID */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 px-4 py-1 border border-blue-500/30 bg-blue-500/5 rounded-full backdrop-blur-md"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-blue-400">Global IT Delivery Organization</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]"
          >
            Architecting <br />
            <span className="text-zinc-500">Digital Power.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-8 max-w-3xl text-zinc-400 font-light text-lg md:text-xl leading-relaxed mx-auto"
          >
            A high-performance engineering powerhouse deploying elite multi-domain teams 
            to solve the world’s most complex technological challenges.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-8 opacity-40 grayscale"
          >
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest"><Globe className="w-3 h-3" /> DISTRIBUTED NETWORK</div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest"><Cpu className="w-3 h-3" /> ENTERPRISE CORE</div>
            <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest"><ShieldCheck className="w-3 h-3" /> MILITARY-GRADE SECURITY</div>
          </motion.div>
        </section>

        {/* 2. WHO WE ARE - THE DISTRIBUTED IT FARM */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Identity // Core</h2>
              <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
                An Extension of <br /> Your Engineering.
              </h3>
              <div className="space-y-6 text-zinc-400 text-lg font-light leading-relaxed">
                <p>
                  We are not a traditional agency. We are a distributed <strong>IT Farm</strong>&mdash;a specialized infrastructure 
                  designed for the centralized leadership of decentralized elite engineering squads. 
                </p>
                <p>
                  By bridging the gap between talent and execution, we serve as a scalable backbone for high-growth startups, 
                  global enterprises, and digital agencies. Our model allows us to maintain the agility of a startup with the 
                  industrial-strength delivery of a global firm.
                </p>
              </div>
            </motion.div>

            <div className="relative">
              <AnimatedBorderCard>
                <div className="space-y-8 py-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl"><Server className="w-6 h-6 text-blue-500" /></div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Centralized Governance</h4>
                      <p className="text-zinc-500 text-sm">Strict oversight and strategic management from our primary operations hub.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl"><Users className="w-6 h-6 text-blue-500" /></div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Decentralized Elite Squads</h4>
                      <p className="text-zinc-500 text-sm">Specialized task forces hand-picked for domain-specific execution.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl"><Zap className="w-6 h-6 text-blue-500" /></div>
                    <div>
                      <h4 className="text-white font-bold mb-1">High-Velocity Scaling</h4>
                      <p className="text-zinc-500 text-sm">Rapid resource allocation to match the pace of enterprise requirements.</p>
                    </div>
                  </div>
                </div>
              </AnimatedBorderCard>
            </div>
          </div>
        </section>

        {/* 3. THE IT FARM MODEL */}
        <section className="py-32 bg-zinc-950/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter">
                The IT Farm <span className="text-zinc-500">Model.</span>
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-10 bg-zinc-950/60 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                <div className="text-blue-500 font-mono text-4xl font-bold mb-6">01</div>
                <h4 className="text-2xl font-bold mb-4">Requirement Extraction</h4>
                <p className="text-zinc-500 leading-relaxed font-light">
                  Clients don&#39;t hire freelancers; they submit an objective. Our technical architects conduct a deep-dive 
                  review to scope infrastructure, security, and scalability needs.
                </p>
              </div>
              <div className="p-10 bg-zinc-950/60 border border-blue-500/20 rounded-[2.5rem] backdrop-blur-xl shadow-[0_0_40px_rgba(59,130,246,0.1)]">
                <div className="text-blue-500 font-mono text-4xl font-bold mb-6">02</div>
                <h4 className="text-2xl font-bold mb-4">Squad Deployment</h4>
                <p className="text-zinc-500 leading-relaxed font-light">
                  We deploy managed elite squads. Based on the domain (AI, Web, Cloud), we assign a dedicated project 
                  lead, senior engineers, QA testers, and a security officer.
                </p>
              </div>
              <div className="p-10 bg-zinc-950/60 border border-white/10 rounded-[2.5rem] backdrop-blur-xl">
                <div className="text-blue-500 font-mono text-4xl font-bold mb-6">03</div>
                <h4 className="text-2xl font-bold mb-4">Operations Managed</h4>
                <p className="text-zinc-500 leading-relaxed font-light">
                  We handle the management, payroll, governance, and quality assurance. The client monitors progress 
                  via a single point of truth while we manage the machine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ORDER FULFILLMENT WORKFLOW */}
        <section className="max-w-7xl mx-auto px-6 py-32">
          <div className="grid lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Workflow // Operations</h2>
              <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
                Execution <br /> Logic.
              </h3>
              <p className="text-zinc-400 font-light leading-relaxed">
                A surgical, step-by-step pipeline designed for zero-latency delivery and enterprise stability.
              </p>
            </div>
            <div className="lg:col-span-8 space-y-12">
              {[
                { step: "01", title: "Intake & Scoping", desc: "Detailed analysis of business logic, user personas, and technical constraints." },
                { step: "02", title: "Architecture Design", desc: "Crafting the blueprint: database schemas, cloud infrastructure, and API documentation." },
                { step: "03", title: "Squad Assembly", desc: "Allocating specific domain experts (Frontend, AI, DevOps) from our internal farm network." },
                { step: "04", title: "Agile Execution", desc: "Sprint-based development cycles with bi-weekly updates and real-time environment access." },
                { step: "05", title: "Security Hardening", desc: "Penetration testing, encryption audits, and compliance checks (GDPR/HIPAA/SOC2)." },
                { step: "06", title: "Deployment & Scaling", desc: "Seamless CI/CD orchestration to production with 24/7 reliability monitoring." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative flex gap-8 p-8 border border-white/5 rounded-3xl hover:border-white/20 hover:bg-white/2 transition-all"
                >
                  <div className="text-blue-500 font-mono text-xl font-bold">{item.step}</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-500 transition-colors">{item.title}</h4>
                    <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. DOMAIN COVERAGE */}
        <section className="py-32">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-mono uppercase tracking-[0.4em] text-center mb-16 text-zinc-500">Domain Expertise</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 border border-white/10 rounded-[3rem] overflow-hidden">
              {[
                { icon: Globe, label: "Web & SaaS" },
                { icon: Cpu, label: "AI & ML" },
                { icon: Phone, label: "Mobile Apps" },
                { icon: Server, label: "Cloud & DevOps" },
                { icon: Database, label: "Enterprise Software" },
                { icon: Layers, label: "UI/UX Product Design" },
                { icon: Lock, label: "Cybersecurity" },
                { icon: BarChart3, label: "Automation Systems" }
              ].map((domain, i) => (
                <div key={i} className="bg-black p-10 flex flex-col items-center justify-center text-center group hover:bg-zinc-950 transition-colors">
                  <div className="text-zinc-600 mb-4 group-hover:text-blue-500 transition-colors transform group-hover:scale-110 duration-500">
                      <domain.icon size={32} />
                    </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">{domain.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. GOVERNANCE & SECURITY */}
        <section className="max-w-5xl mx-auto px-6 py-32">
          <AnimatedBorderCard>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
                  <ShieldCheck className="text-blue-500" />
                </div>
                <h3 className="text-4xl font-bold mb-6 tracking-tight">Enterprise Governance.</h3>
                <p className="text-zinc-400 font-light leading-relaxed mb-6">
                  We enforce a &quot;Compliance-First&quot; mindset. Every line of code passes through rigorous QA pipelines 
                  and automated security audits before it touches your environment.
                </p>
                <ul className="space-y-3 text-sm font-mono text-zinc-500">
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500" /> Mandatory Peer Code Reviews</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500" /> AES-256 Data Encryption Standards</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500" /> Strict IP & Data Confidentiality</li>
                  <li className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500" /> SOC2 / ISO Compliant Pipelines</li>
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Uptime Stability</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white mb-2">ZERO</div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Security Breach</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white mb-2">24/7</div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Global Support</div>
                </div>
                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white mb-2">ISO</div>
                  <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-500">Standard Code</div>
                </div>
              </div>
            </div>
          </AnimatedBorderCard>
        </section>

        {/* 7. FOUNDERS SECTION */}
        <section className="max-w-6xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">The <span className="text-zinc-500">Commanders.</span></h2>
            <p className="mt-4 text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Elite Leadership Core</p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            <FounderCard
              name="Mayank Kumar Sharma"
              role="Co-Founder & Full-Stack Developer"
              email="team.techserve55@gmail.com"
              phone="+918159842418"
              githubUrl="https://github.com/Mayank8159"
              linkedinUrl="https://www.linkedin.com/in/mayank-kumar-sharma-900318318/"
              imageSrc="/founders/Mayank.png"
              description="Lead Architect specializing in AI platform engineering and decentralized systems. Drives the technical vision for scalable delivery."
            />

            <FounderCard
              name="Shreyan Mitra"
              role="Co-Founder & Software Developer"
              email="team.techserve55@gmail.com"
              phone="+918240591893"
              githubUrl="https://github.com/shreyan"
              linkedinUrl="https://linkedin.com/in/shreyan"
              imageSrc="/founders/shreyan.jpeg"
              description="Chief Reliability Officer. Expert in high-performance backends, cloud orchestration, and enterprise-grade infrastructure."
            />
          </div>
        </section>

        {/* 8. VISION SECTION */}
        <section className="max-w-4xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-blue-500 font-mono text-xs uppercase tracking-[0.4em] mb-4">Vision // 2030</h2>
            <h3 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-8">Becoming the Backbone of <span className="text-zinc-500">Global Innovation.</span></h3>
            <p className="text-zinc-400 text-lg font-light leading-relaxed italic">
              &quot;We aren&rsquo;t just building software; we are building the global delivery infrastructure that will 
              power the next generation of startups and enterprises. Our goal is to make high-end engineering 
              as accessible and scalable as cloud computing.&quot;
            </p>
          </motion.div>
        </section>

        {/* 9. CTA SECTION */}
        <section className="max-w-7xl mx-auto px-6 pb-32">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative rounded-[3rem] p-16 md:p-24 overflow-hidden border border-white/10 bg-zinc-950/40 backdrop-blur-3xl text-center group"
          >
             <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
             
             <h2 className="relative text-4xl md:text-7xl font-black italic uppercase tracking-tighter mb-8">
               Ready to Deploy <br /> Your <span className="text-blue-500">Elite Squad?</span>
             </h2>
             <button className="relative px-12 py-6 bg-white text-black rounded-full font-black uppercase text-sm tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3 mx-auto group active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
               Start Global Build <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
             </button>
          </motion.div>
        </section>

        <footer className="py-10 text-center border-t border-white/5 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          © 2026 IT FARM GLOBAL DELIVERY NETWORK. ALL RIGHTS RESERVED.
        </footer>
      </div>
    </main>
  );
}

/* ===================== ANIMATED BORDER CARD ===================== */

function AnimatedBorderCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative rounded-3xl p-[1.5px] overflow-hidden"
    >
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute inset-0 rounded-3xl
          bg-[linear-gradient(110deg,transparent,rgba(59,130,246,0.3),transparent)]
          bg-size-[200%_100%]"
      />

      <div className="relative bg-zinc-950/60 border border-white/10 rounded-3xl p-8 md:p-10 backdrop-blur-2xl shadow-2xl">
        {children}
      </div>
    </motion.div>
  );
}

/* ===================== FOUNDER CARD ===================== */

function FounderCard({
  name,
  role,
  email,
  phone,
  description,
  imageSrc,
  githubUrl,
  linkedinUrl,
}: {
  name: string;
  role: string;
  email: string;
  phone: string;
  description: string;
  imageSrc: string;
  githubUrl: string;
  linkedinUrl: string;
}) {
  return (
    <AnimatedBorderCard>
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-20 w-20 rounded-full overflow-hidden bg-linear-to-br from-zinc-100 via-zinc-400 to-zinc-600 p-0.5 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <div className="relative h-full w-full rounded-full overflow-hidden bg-black">
            <Image 
              src={imageSrc} 
              alt={name} 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
              sizes="80px"
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold tracking-tight">{name}</h3>
          <p className="text-blue-500 text-[10px] font-mono uppercase tracking-[0.2em]">{role}</p>
        </div>
      </div>

      <p className="text-zinc-400 leading-relaxed mb-8 text-sm h-14 italic font-light">
        &quot;{description}&quot;
      </p>

      {/* CONTACT & SOCIAL FOOTER */}
      <div className="flex flex-col gap-6 pt-6 border-t border-white/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* CONTACT ACTIONS */}
          <div className="flex flex-col gap-3">
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
              <Mail className="h-4 w-4 group-hover:text-blue-500 transition-colors" /> 
              <span className="text-xs font-mono">{email}</span>
            </a>
            
            <a 
              href={`tel:${phone}`} 
              className="flex items-center gap-2 w-fit bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-zinc-300 hover:text-white transition-all active:scale-95 group"
            >
              <Phone className="h-3.5 w-3.5 text-blue-500 group-hover:animate-pulse" /> 
              <span className="text-[10px] font-bold uppercase tracking-widest">Direct Line</span>
            </a>
          </div>

          {/* SOCIAL LINKS */}
          <div className="flex gap-3">
            <a 
              href={githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:bg-white/10"
            >
              <Github className="h-5 w-5 text-zinc-400 hover:text-white" />
            </a>
            <a 
              href={linkedinUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 bg-white/5 rounded-xl border border-white/5 hover:border-white/20 transition-all hover:bg-white/10"
            >
              <Linkedin className="h-5 w-5 text-zinc-400 hover:text-white" />
            </a>
          </div>

        </div>
      </div>
    </AnimatedBorderCard>
  );
}