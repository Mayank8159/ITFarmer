import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/Footer';
import WorkflowTimeline from '@/components/sections/WorkflowTimeline';
import { ArrowRight, Mail, Globe, Github as GithubIcon, Linkedin as LinkedinIcon, Terminal } from 'lucide-react';
import { getAboutData } from '@/app/actions/adminActions';

export const metadata = {
  title: 'About | Neural Forge Hub',
  description: 'An AI & Software Engineering Studio specializing in production ML, computer vision, and full-stack applications.',
};

export default async function AboutPage() {
  const team = await getAboutData();

  return (
    <main className="relative min-h-screen bg-[#fafafa] text-black overflow-x-hidden pt-28">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 pb-20">

        {/* 1. HERO SECTION */}
        <section className="relative min-h-[60vh] flex flex-col items-start justify-center border-b-2 border-black pb-16">
          <div className="border-4 border-black px-4 py-2 mb-8 bg-white inline-flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-3 h-3 bg-[#ff6b00] animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-black font-black">
              System Architecture & Engineering
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black">
            WE NEVER BUILD PROTOTYPES.<br />
            <span className="text-[#ff6b00]">WE ONLY BUILD<br/>WORKING PRODUCTS.</span>
          </h1>

          <p className="mt-8 max-w-3xl text-black font-mono text-lg leading-relaxed border-l-4 border-black pl-6 bg-white p-6 border-r-4 border-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-bold">
            Neural Forge Hub is a specialized engineering studio. We don't just write scripts—we architect and deliver production-ready AI systems, high-performance web applications, and native cross-platform software backed by rigorous system design.
          </p>
        </section>

        {/* 2. THE TECHNICAL ARSENAL (4-Pillar Grid) */}
        <section className="py-24 border-b-2 border-black">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black border-l-4 border-[#ff6b00] pl-4">
              Core Engineering Capabilities
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Column 1 */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transition-all flex flex-col h-full group">
              <h3 className="text-[#ff6b00] font-black mb-6 uppercase text-lg tracking-widest border-b-2 border-black pb-2 inline-block">
                [ AI & ML Engineering ]
              </h3>
              <ul className="space-y-4 font-mono text-sm text-black/80 flex-1 font-bold">
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Custom RAG Pipelines (Retrieval-Augmented Generation)</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Text Encoders & Custom Transformers</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> YOLO Object Detection & CNNs</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Real-Time Anomaly Detection</li>
              </ul>
            </div>

            {/* Column 2 */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transition-all flex flex-col h-full group">
              <h3 className="text-[#ff6b00] font-black mb-6 uppercase text-lg tracking-widest border-b-2 border-black pb-2 inline-block">
                [ Agents & Automation ]
              </h3>
              <ul className="space-y-4 font-mono text-sm text-black/80 flex-1 font-bold">
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Autonomous AI Agents & Orchestration</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> LLM-Driven Workflow Automation</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Automated Engagement AI</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Zero-Exfiltration Pipelines</li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transition-all flex flex-col h-full group">
              <h3 className="text-[#ff6b00] font-black mb-6 uppercase text-lg tracking-widest border-b-2 border-black pb-2 inline-block">
                [ Full-Stack Web Applications ]
              </h3>
              <ul className="space-y-4 font-mono text-sm text-black/80 flex-1 font-bold">
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Next.js High-Performance Interfaces</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Full-Stack SaaS Architecture</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Server-Side Caching (ISR)</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Zero-Bloat State Management</li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(255,107,0,1)] transition-all flex flex-col h-full group">
              <h3 className="text-[#ff6b00] font-black mb-6 uppercase text-lg tracking-widest border-b-2 border-black pb-2 inline-block">
                [ Native Apps & Systems Software ]
              </h3>
              <ul className="space-y-4 font-mono text-sm text-black/80 flex-1 font-bold">
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Native Android Applications (.apk)</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Windows Desktop Software (.exe)</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> Hardware-to-Software Integration</li>
                <li className="flex items-start gap-2"><span className="text-black group-hover:text-[#ff6b00] transition-colors">›</span> OS-Level System Architecture</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 3. THE WORKFLOW TIMELINE */}
        <section className="py-24 border-b-2 border-black">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black border-l-4 border-[#ff6b00] pl-4 mb-4">
              Our Engineering Workflow
            </h2>
            <p className="font-mono text-black/70 max-w-2xl text-sm font-bold">
              We operate on a strict, anti-fragile methodology. We never build fragile UI wrappers; we engineer complete, scalable systems through a rigorous 4-phase delivery pipeline.
            </p>
          </div>
          
          <WorkflowTimeline />
        </section>

        {/* 4. THE CORE TEAM */}
        <section className="py-24 border-b-2 border-black">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black border-l-4 border-[#ff6b00] pl-4">
              The Team
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team && team.length > 0 ? team.map((member: any) => (
              <div key={member.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full group">
                <div className="p-8 border-b-4 border-black flex items-center gap-6 bg-[#f0f0f0] group-hover:bg-[#ff6b00]/10 transition-colors">
                  <div className="relative h-24 w-24 border-4 border-black bg-black flex-shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
                      />
                    ) : (
                      <span className="text-white font-mono text-xs">NO IMG</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-black uppercase leading-tight mb-2">{member.name}</h3>
                    <p className="bg-black text-white px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest inline-block font-bold">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="p-8 flex-1">
                  <p className="text-black/80 text-sm font-mono leading-relaxed font-bold border-l-4 border-[#ff6b00] pl-4 whitespace-pre-line">
                    {member.description}
                  </p>
                </div>
                <div className="p-4 border-t-4 border-black flex flex-wrap gap-4 bg-[#f0f0f0]">
                  {member.email && (
                    <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${member.email}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-black text-black hover:text-[#ff6b00] flex items-center gap-2 uppercase">
                      <Mail className="w-4 h-4" /> Contact
                    </a>
                  )}
                  {member.github && (
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-black text-black hover:text-[#ff6b00] flex items-center gap-2 uppercase">
                      <GithubIcon className="w-4 h-4" /> GitHub
                    </a>
                  )}
                  {member.linkedin && (
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-black text-black hover:text-[#ff6b00] flex items-center gap-2 uppercase">
                      <LinkedinIcon className="w-4 h-4" /> LinkedIn
                    </a>
                  )}
                  {member.portfolio && (
                    <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-black text-black hover:text-[#ff6b00] flex items-center gap-2 uppercase">
                      <Globe className="w-4 h-4" /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-12 text-center text-black font-mono font-bold uppercase tracking-widest">
                System initializing... Waiting for founder data.
              </div>
            )}
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <section className="py-24 flex justify-center">
          <div className="bg-white border-4 border-black p-12 text-center max-w-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-8">
              <Terminal className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[1] text-black">
              Ready to transition from prototype to <span className="text-[#ff6b00]">production?</span>
            </h2>
            <p className="text-black/70 font-mono font-bold mb-10 max-w-xl mx-auto">
              Partner with builders who actually ship. Schedule a technical consult to review your architecture.
            </p>
            <Link 
              href="/contact" 
              className="px-8 py-5 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-sm border-4 border-black hover:bg-black hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-3 w-fit mx-auto group"
            >
              Book a Technical Strategy Call <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}