"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Copy, Check, Terminal } from "lucide-react";

const REQUEST_BODY = `{
  "model": "neural-forge-v2",
  "messages": [
    {
      "role": "system",
      "content": "You are a cybernetic intelligence."
    },
    {
      "role": "user",
      "content": "Initialize core sequence."
    }
  ],
  "temperature": 0.1,
  "max_tokens": 512
}`;

const RESPONSE_SUCCESS = `{
  "id": "nf-res-8f92j1",
  "object": "chat.completion",
  "created": 1723145800,
  "model": "neural-forge-v2",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Core sequence initialized. Neural pathways stabilized at 98.4%. Ready for directive."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 14,
    "total_tokens": 32
  },
  "latency_ms": 42
}`;

export default function ApiPlayground() {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/systemConfig')
      .then(res => res.json())
      .then(data => setConfig(data.apiPlayground))
      .catch(err => console.error("Failed to load api config:", err));
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REQUEST_BODY);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setResponse("");
    
    setTimeout(() => {
      let currentIndex = 0;
      const streamInterval = setInterval(() => {
        if (currentIndex < RESPONSE_SUCCESS.length) {
          const chunk = RESPONSE_SUCCESS.slice(0, currentIndex + 5); 
          setResponse(chunk);
          currentIndex += 5;
        } else {
          setResponse(RESPONSE_SUCCESS);
          setRunning(false);
          clearInterval(streamInterval);
        }
      }, 20);
    }, 800);
  };

  return (
    <section className="relative w-full bg-[#f0f0f0] py-32 z-10">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#ff6b00] mb-4 block font-bold">DEVELOPER EXPERIENCE</span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-black uppercase max-w-2xl leading-[0.9]">
            {config?.title || "INTEGRATE IN SECONDS."}
          </h2>
        </div>

        {/* Terminal UI */}
        <div className="border border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* Header */}
          <div className="bg-black text-white px-4 py-3 flex items-center justify-between border-b border-black">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
              <div className="w-3 h-3 bg-white" />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold">
              <Terminal className="w-4 h-4" />
              <span>NEURAL FORGE API</span>
            </div>
            <div className="w-16" /> {/* spacer */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* LEFT: Request */}
            <div className="p-6 md:border-r border-black bg-white">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2 py-1 bg-[#ff6b00] text-white font-mono text-[10px] font-bold">POST</span>
                  <span className="font-mono text-xs text-black font-bold">https://api.neuralforgehub.tech/v1/chat</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleCopy}
                    className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                    title="Copy Request"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleRun}
                    disabled={running}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-[#ff6b00] transition-colors border border-black text-xs font-mono uppercase font-bold disabled:opacity-50"
                  >
                    {running ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-3 h-3 border-2 border-white border-t-transparent" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                    {running ? "EXECUTING" : "RUN"}
                  </button>
                </div>
              </div>

              <pre className="font-mono text-sm text-black bg-[#f0f0f0] p-4 border border-black overflow-x-auto">
                <code dangerouslySetInnerHTML={{
                  __html: REQUEST_BODY
                    .replace(/"([^"]+)":/g, '<span class="font-bold text-black">"$1"</span>:')
                    .replace(/: "([^"]+)"/g, ': <span class="text-[#ff6b00]">"$1"</span>')
                    .replace(/: ([0-9.]+)/g, ': <span class="text-blue-600 font-bold">$1</span>')
                    .replace(/: (true|false)/g, ': <span class="text-blue-600 font-bold">$1</span>')
                }} />
              </pre>
            </div>

            {/* RIGHT: Response */}
            <div className="p-6 bg-[#111111] relative min-h-[300px]">
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-white/50 mb-6">RESPONSE</div>
              
              <AnimatePresence mode="wait">
                {running && response === "" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-white font-mono text-xs uppercase"
                  >
                    <div className="w-8 h-8 border-4 border-white/20 border-t-white animate-spin mb-4" />
                    <div>Establishing secure connection...</div>
                  </motion.div>
                )}
                
                {response !== null && response !== "" && (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-mono text-sm text-white overflow-x-auto h-full"
                  >
                    <pre>
                      <code dangerouslySetInnerHTML={{
                        __html: response
                          .replace(/"([^"]+)":/g, '<span class="font-bold text-white/80">"$1"</span>:')
                          .replace(/: "([^"]+)"/g, ': <span class="text-[#ff6b00]">"$1"</span>')
                          .replace(/: ([0-9.]+)/g, ': <span class="text-blue-400 font-bold">$1</span>')
                      }} />
                    </pre>
                    {running && <span className="inline-block w-3 h-5 bg-[#ff6b00] animate-pulse ml-1 align-middle" />}
                  </motion.div>
                )}

                {!running && response === null && (
                  <motion.div 
                    key="idle"
                    className="absolute inset-0 flex items-center justify-center text-white/30 font-mono text-xs uppercase tracking-widest"
                  >
                    Click RUN to execute request
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}