"use client";

import React, { JSX } from "react";
import { motion } from "framer-motion";
import { Terminal, Database, Server, Cpu, Radio, Layout } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";

const PROJECTS = [
  {
    name: "ROCm Bridge",
    stack: "C++, Python, CUDA, HIP",
    focus: "Hardware Portability & Automated Code Cross-Compilation",
    overview: "An automated code transformation pipeline designed to liberate deep learning workloads from proprietary hardware locks.",
    specs: "Analyzes NVIDIA CUDA kernel calls and automatically transpiles them to AMD HIP-compliant C++ codebases.",
    value: "Reduces migration friction for enterprise teams transitioning to AMD GPU clusters, saving months of manual code rewrites.",
    icon: Cpu
  },
  {
    name: "VitalGuard-AI",
    stack: "FastAPI, React, PyTorch, Docker",
    focus: "Real-Time Health Telemetry & Predictive Analytics",
    overview: "An end-to-end telemetry system capturing real-time biometric metrics and executing automated anomaly detection.",
    specs: "Built with a decoupled FastAPI microservice backend connected to a Next.js dashboard via secure WebSockets for sub-second alert dispatch.",
    value: "Demonstrates production readiness for HIPAA-compliant data pipelines and live streaming analytics.",
    icon: Radio
  },
  {
    name: "Zorvyn Finance Engine",
    stack: "Python, FastAPI, MongoDB, Render",
    focus: "High-Availability Financial Microservice & Auth Routing",
    overview: "A secure financial routing and transaction logging API built for high reliability under concurrent load.",
    specs: "Utilizes asynchronous Python (asyncio + motor), custom JWT authentication middleware, strict rate-limiting, and deployment pipeline automation.",
    value: "Proves capability in handling high-security user data, transactional integrity, and scalable cloud deployments.",
    icon: Database
  },
  {
    name: "ITFarmer Platform",
    stack: "Next.js 16, React 19, WebSockets, Motor",
    focus: "Unified Service Inquiry, Admin Engine & Real-Time Alerts",
    overview: "A full-stack IT service platform handling public client requests, dynamic content feeds, and real-time administrative notification feeds.",
    specs: "Next.js 16 App Router frontend paired with a FastAPI/MongoDB backend using persistent WebSocket channels for instant admin telemetry.",
    value: "Shows end-to-end client management capability and live state synchronization across distributed web clients.",
    icon: Server
  },
  {
    name: "Humanoid Telemetry Controller",
    stack: "C++, Arduino, Hardware Sensor Arrays",
    focus: "Real-Time Motor Signal Sync & Embedded Robotics Control",
    overview: "An embedded hardware-software integration interface designed to orchestrate multi-axis motor movements and sensor readings.",
    specs: "Microcontroller programming linked with custom radar/flame sensor inputs, driving synchronous servo and motor arrays via optimized low-latency signal loops.",
    value: "Proves cross-domain engineering competence bridging high-level software down to physical hardware execution.",
    icon: Terminal
  },
  {
    name: "BazaarLink",
    stack: "MERN Stack, Next.js, FastAPI",
    focus: "Scalable Multi-Tenant E-Commerce & Inventory Pipeline",
    overview: "A modular full-stack web system optimized for fast product catalog indexing, dynamic client state management, and API routing.",
    specs: "Modular component architecture with clean REST API abstractions connecting modern client views to scalable backend persistence layers.",
    value: "Highlights UI component engineering, clean architectural patterns, and reusable client-side data fetching strategies.",
    icon: Layout
  }
];

const UPDATES = [
  {
    date: "AUG 09, 2026",
    title: "VITALGUARD V2 DEPLOYED",
    content: "The latest iteration of VitalGuard-AI has successfully passed HIPAA compliance benchmarking and is now actively monitoring over 10,000 live patient telemetry streams with sub-50ms latency.",
    tag: "INFRASTRUCTURE"
  },
  {
    date: "AUG 01, 2026",
    title: "NEURAL FORGE HUB LAUNCH",
    content: "Our central command platform is officially online. This hub will serve as the primary routing layer for all incoming enterprise requests and autonomous agent deployments.",
    tag: "SYSTEM"
  },
  {
    date: "JUL 15, 2026",
    title: "ROCM BRIDGE v1.2 UPDATE",
    content: "Expanded CUDA-to-HIP transpilation rules to support the latest PyTorch tensor operations. Compilation times reduced by 14% on enterprise hardware clusters.",
    tag: "ENGINEERING"
  }
];

export default function ArchivesPage(): JSX.Element {
  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        
        {/* HEADER */}
        <div className="mb-16 border-b-4 border-black pb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="bg-black text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6">
              THE FORGE ARCHIVES
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9] text-black"
            >
              PROJECT <br /><span className="text-[#ff6b00]">CATALOG.</span>
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
        <div className="grid md:grid-cols-2 gap-8">
          {PROJECTS.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <BrutalistCard whiteBg className="h-full flex flex-col hover:border-[#ff6b00] transition-colors group">
                
                {/* PROJECT HEADER */}
                <div className="flex items-start gap-4 mb-6 pb-6 border-b border-black">
                  <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0 group-hover:bg-[#ff6b00] transition-colors">
                    <project.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase text-black leading-tight mb-2">
                      {project.name}
                    </h2>
                    <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-white bg-black px-2 py-0.5 inline-block">
                      {project.stack}
                    </div>
                  </div>
                </div>

                {/* PROJECT DETAILS */}
                <div className="flex-1 flex flex-col gap-6">
                  <div>
                    <h4 className="text-[10px] font-mono text-[#ff6b00] font-bold uppercase tracking-widest mb-1">
                      CORE ENGINEERING FOCUS
                    </h4>
                    <p className="font-black text-black uppercase leading-tight">
                      {project.focus}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-[10px] font-mono text-black/50 font-bold uppercase tracking-widest mb-1 border-b border-black/10 pb-1">
                      OVERVIEW
                    </h4>
                    <p className="font-mono text-sm text-black/70 leading-relaxed mt-2">
                      {project.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono text-black/50 font-bold uppercase tracking-widest mb-1 border-b border-black/10 pb-1">
                      ENGINEERING SPECS
                    </h4>
                    <p className="font-mono text-sm text-black/70 leading-relaxed mt-2">
                      {project.specs}
                    </p>
                  </div>
                </div>

                {/* VALUE PROP */}
                <div className="mt-8 pt-4 border-t-2 border-black">
                  <h4 className="text-[10px] font-mono text-black font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#ff6b00]" /> IMPACT
                  </h4>
                  <p className="font-mono text-sm text-black font-bold">
                    {project.value}
                  </p>
                </div>

              </BrutalistCard>
            </motion.div>
          ))}
        </div>

        {/* LIVE UPDATES SECTION */}
        <div className="mt-32 pt-20 border-t-4 border-black">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="bg-[#ff6b00] text-white text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1 w-fit mb-6 animate-pulse">
                LIVE FEED
              </div>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-black">
                SYSTEM <br />UPDATES.
              </h2>
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory w-full">
            {UPDATES.map((update, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[85vw] md:min-w-[600px] snap-start bg-white border-2 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group flex flex-col md:flex-row gap-8"
              >
                {/* Meta */}
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-black/50 mb-2">{update.date}</div>
                    <div className="text-[10px] font-mono font-bold text-white bg-black px-2 py-1 inline-block uppercase tracking-widest group-hover:bg-[#ff6b00] transition-colors">
                      {update.tag}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 border-l-2 border-black/10 pl-0 md:pl-8">
                  <h3 className="font-black text-2xl uppercase text-black mb-4 group-hover:text-[#ff6b00] transition-colors">{update.title}</h3>
                  <p className="font-mono text-sm text-black/70 leading-relaxed font-bold max-w-[500px]">
                    {update.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}