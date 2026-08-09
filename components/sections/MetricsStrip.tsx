"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function MetricsStrip() {
  const prefersReducedMotion = useReducedMotion();
  const [activeAgents, setActiveAgents] = useState(24);
  const [gpuCompute, setGpuCompute] = useState(1.84);
  const [requests, setRequests] = useState(2405932);

  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/data/systemConfig.json?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        setConfig(data.metrics);
        setActiveAgents(data.metrics.activeAgents || 24);
        setGpuCompute(data.metrics.gpuCompute || 1.84);
        setRequests(data.metrics.requests || 2405932);
      })
      .catch(err => console.error("Failed to load metrics data:", err));
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !config) return;
    const interval = setInterval(() => {
      setActiveAgents(prev => (Math.random() > 0.8 ? prev + (Math.random() > 0.5 ? 1 : -1) : prev));
      setGpuCompute(prev => {
        const val = prev + (Math.random() * 0.02 - 0.01);
        const base = config.gpuCompute || 1.84;
        return Math.max(base - 0.1, Math.min(base + 0.1, val));
      });
      setRequests(prev => prev + Math.floor(Math.random() * 7));
    }, 1500);
    return () => clearInterval(interval);
  }, [prefersReducedMotion, config]);

  const METRICS = [
    { label: "ACTIVE AGENTS", value: Math.max(20, activeAgents).toString(), indicator: true },
    { label: "GPU COMPUTE", value: `${gpuCompute.toFixed(2)} PFLOPS`, indicator: false },
    { label: "INFERENCE REQUESTS", value: requests.toLocaleString("en-US"), indicator: false },
    { label: "SYSTEM UPTIME", value: "99.99%", indicator: true }
  ];

  return (
    <div className="relative w-full border-y border-black bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black border-x border-black">
          {METRICS.map((metric, idx) => (
            <div 
              key={idx}
              className="py-10 px-6 flex flex-col items-center justify-center text-center group hover:bg-[#ff6b00] hover:text-white transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                {metric.indicator && <div className="w-2 h-2 bg-black group-hover:bg-white" />}
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-black/60 group-hover:text-white/80 transition-colors">
                  {metric.label}
                </span>
              </div>
              <span className="text-3xl md:text-5xl font-black text-black group-hover:text-white transition-colors tracking-tighter">
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}