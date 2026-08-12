"use client";

import React, { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { Terminal, Database, Server, Cpu, Radio, Layout, FileText, Globe } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

function ProjectCard({ project }: { project: any }) {
  // Determine available tabs
  const tabs = [];
  if (project.architectureImage) tabs.push({ id: 'architecture', label: 'ARCHITECTURE' });
  if (project.image) tabs.push({ id: 'cover', label: 'COVER' });
  if (project.link) tabs.push({ id: 'preview', label: 'LIVE PREVIEW' });

  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].id : null);

  return (
    <BrutalistCard whiteBg className="flex flex-col hover:border-[#ff6b00] transition-colors group p-0 overflow-hidden h-full">
      {/* PROJECT HEADER */}
      <div className="p-8 md:p-12 border-b-4 border-black">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white bg-black px-3 py-1 mb-4 inline-block">
              [{project.scope === "Client" ? "CLIENT BUILD" : "INTERNAL BUILD"}] • {project.client ? project.client : "Neural Forge Hub"} • {project.date}
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-black leading-[0.9] tracking-tighter">
              {project.title}
            </h2>
          </div>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="flex-shrink-0 px-6 py-3 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
              View Live Deployment
            </a>
          )}
        </div>
        
        {project.technologies && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.split(',').map((tech: string, i: number) => (
              <span key={i} className="font-mono text-[10px] uppercase tracking-widest font-bold text-black border border-black/20 px-2 py-1 bg-black/5">
                {tech.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* PROJECT BODY */}
      <div className="grid md:grid-cols-2 gap-0 flex-1">
        {/* Left Column: Visuals (Tabs + Content) */}
        <div className="border-r-0 md:border-r-4 border-black border-b-4 md:border-b-0 flex flex-col h-full bg-[#f8f8f8]">
          
          {/* Visual Tabs */}
          {tabs.length > 1 && (
            <div className="flex border-b-4 border-black bg-white shrink-0">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 font-mono text-[10px] font-bold uppercase tracking-widest border-r-4 border-black last:border-r-0 transition-colors ${activeTab === tab.id ? 'bg-[#ff6b00] text-black' : 'bg-white text-black/60 hover:bg-black/5 hover:text-black'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Visual Content */}
          <div className="flex-1 w-full min-h-[350px] relative bg-black/5 flex items-center justify-center overflow-hidden">
            {!activeTab ? (
               <Server className="w-12 h-12 text-black/20" />
            ) : activeTab === 'architecture' ? (
              <div className="absolute inset-0 bg-white flex items-center justify-center p-8 group-hover:bg-black/5 transition-colors">
                <img src={project.architectureImage} alt={`${project.title} Architecture`} className="w-full h-full object-contain mix-blend-multiply drop-shadow-md hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-black text-[#ff6b00] px-2 py-1 text-[8px] font-mono font-bold uppercase tracking-widest border border-black/20">SYSTEM DIAGRAM</div>
              </div>
            ) : activeTab === 'cover' ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center p-4">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700 border border-white/10" />
              </div>
            ) : activeTab === 'preview' ? (
              <div className="absolute inset-0 bg-[#f0f0f0] overflow-hidden group/preview block h-full">
                {/* Browser Header */}
                <div className="bg-black px-4 py-2 flex items-center gap-2 border-b-4 border-black absolute top-0 left-0 right-0 z-20">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center font-mono text-[10px] text-white/70 truncate px-2">
                    {project.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </div>
                </div>
                {/* Live iframe */}
                <div className="absolute top-[36px] left-0 right-0 bottom-0 overflow-hidden">
                  <iframe 
                    src={project.link}
                    className="absolute top-0 left-0 w-[400%] h-[400%] origin-top-left pointer-events-none opacity-80 group-hover/preview:opacity-100 transition-opacity grayscale group-hover/preview:grayscale-0 duration-500"
                    style={{ transform: 'scale(0.25)' }}
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover/preview:bg-transparent transition-colors z-10" />
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity">
                    <span className="bg-[#ff6b00] text-black font-black font-mono text-xs px-4 py-2 border-2 border-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Open Live App
                    </span>
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-8 bg-white border-t-4 border-black">
             <h4 className="text-[10px] font-mono text-black/50 font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2">
               OVERVIEW
             </h4>
             <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
               {project.description || "No overview provided."}
             </p>
          </div>
        </div>

        {/* Right Column: Challenge, Solution, Results */}
        <div className="flex flex-col bg-white">
          <div className="p-8 border-b-4 border-black flex-1">
            <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
              <Radio className="w-3 h-3" /> THE CHALLENGE
            </h4>
            <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
              {project.challenge || "Engineering problem definition pending."}
            </p>
          </div>
          <div className="p-8 border-b-4 border-black flex-1 bg-black/5">
            <h4 className="text-[10px] font-mono text-black font-bold uppercase tracking-widest mb-4 border-b border-black/10 pb-2 flex items-center gap-2">
              <Layout className="w-3 h-3" /> THE SOLUTION
            </h4>
            <p className="font-mono text-sm text-black/80 leading-relaxed whitespace-pre-wrap">
              {project.solution || "Technical implementation details pending."}
            </p>
          </div>
          <div className="p-8 flex-1 bg-black text-white relative overflow-hidden group-hover:bg-[#111] transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b00]/10 rounded-full blur-3xl" />
            <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-4 border-b border-white/20 pb-2 flex items-center gap-2 relative z-10">
              <Terminal className="w-3 h-3" /> ENGINEERING RESULTS
            </h4>
            <p className="font-mono text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-bold relative z-10">
              {project.results || "Performance metrics pending."}
            </p>
          </div>
        </div>
      </div>
    </BrutalistCard>
  );
}

export default function ArchivesPage(): JSX.Element {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/postsContent')
      .then(res => res.json())
      .then(data => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading posts data:", err);
        setIsLoading(false);
      });
  }, []);

  const safePosts = Array.isArray(posts) ? posts : [];
  const projects = safePosts.filter(p => p.category === "Work");
  
  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 flex items-center justify-center">
        <div className="font-mono text-xs uppercase tracking-widest text-black/50 animate-pulse">Accessing Archives...</div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16 border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
              PRODUCTION ENGINEERING PORTFOLIO
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black"
            >
              CASE <br /><span className="text-[#ff6b00]">STUDIES.</span>
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.2 }} 
            className="text-black/70 font-mono text-sm max-w-sm bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            A comprehensive index of our engineering executions. The Problem, The Architecture, and The Engineering Impact.
          </motion.p>
        </div>

        {/* PROJECT GRID */}
        <div className="grid grid-cols-1 gap-16">
          {projects.length === 0 && !isLoading ? (
            <div className="text-center py-20 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-3xl font-black uppercase mb-4 text-black">[ SYSTEM STATUS: INDEXING ARCHIVES ]</h3>
              <p className="font-mono text-sm text-black/70 mb-8 max-w-md mx-auto">
                We are currently compiling our recent production builds. In the meantime, book a call and we'll walk you through our recent engineering work.
              </p>
              <a href="/contact" className="px-6 py-3 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-xs border-2 border-black inline-block hover:bg-black hover:text-white transition-colors">
                Review Your Architecture
              </a>
            </div>
          ) : (
            projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
              <ProjectCard project={project} />
            </motion.div>
          )))}
        </div>

        </div>
    </main>
  );
}