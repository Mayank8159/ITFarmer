"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, ShieldCheck, Zap, ArrowRight, Loader2, Check } from "lucide-react";
import BrutalistCard from "@/components/cards/BrutalistCard";
import { useCurrency } from "@/components/CurrencyContext";

export default function ServicesPage() {
  const [step, setStep] = useState<"input" | "form" | "loading" | "success">("input");
  
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [customBudget, setCustomBudget] = useState("");
  
  const [formData, setFormData] = useState({ name: "", email: "", details: "" });

  const [captchaParams, setCaptchaParams] = useState({ v1: Math.floor(Math.random() * 10), v2: Math.floor(Math.random() * 10) });
  const [captchaInput, setCaptchaInput] = useState("");
  
  const { formatBudget } = useCurrency();

  const SCOPES = [
    { id: "01", label: "Multi-Agent AI / RAG Pipeline" },
    { id: "02", label: "GPU Portability & C++ Engine" },
    { id: "03", label: "Custom Full-Stack Web Application" },
    { id: "04", label: "Enterprise Backend & Microservices" },
  ];

  const BUDGETS = [
    "< $2,500",
    "$2,500 - $7,500",
    "$7,500 - $15,000+",
    "CUSTOM"
  ];

  const handleExecute = () => {
    if (!selectedScope || !selectedBudget) return;
    setStep("form");
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.details) return;
    
    // Captcha Check
    if (parseInt(captchaInput) !== (captchaParams.v1 + captchaParams.v2)) {
      alert("SECURITY OVERRIDE FAILED: Incorrect calculation.");
      setCaptchaParams({ v1: Math.floor(Math.random() * 10), v2: Math.floor(Math.random() * 10) });
      setCaptchaInput("");
      return;
    }

    setStep("loading");
    
    // Simulate backend processing
    setTimeout(() => {
      setStep("success");
    }, 2000);
  };

  return (
    <main className="relative min-h-screen bg-[#e5e5e5] text-black pt-32 pb-24 overflow-hidden flex flex-col items-center justify-center">
      
      {/* GRID OVERLAY */}
      <div className="absolute inset-0 grid-background opacity-100 pointer-events-none z-0" />

      {/* Terminal CLI Window */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl px-4"
      >
        <div className="bg-[#0a0a0a] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full overflow-hidden flex flex-col font-mono text-white">
          
          {/* CLI Header */}
          <div className="bg-[#1a1a1a] border-b-4 border-black px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Terminal className="w-5 h-5 text-[#ff6b00]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Terminal Project Estimator v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/20" />
              <div className="w-3 h-3 bg-white/40" />
              <div className="w-3 h-3 bg-[#ff6b00]" />
            </div>
          </div>

          <div className="p-6 md:p-10 flex-1 min-h-[500px] flex flex-col relative">
            <AnimatePresence mode="wait">
              {step === "input" && (
                <motion.div 
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-8">
                    <p className="text-[#00ff41] text-sm md:text-base mb-2 font-bold">neuralforge@hub:~$ <span className="text-white font-normal">initialize_project --scope</span></p>
                    <p className="text-white/60 text-xs mt-2 uppercase tracking-widest border-l-2 border-[#ff6b00] pl-3">
                      Select primary engineering scope below:
                    </p>
                  </div>

                  {/* Scopes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    {SCOPES.map(scope => (
                      <button
                        key={scope.id}
                        onClick={() => setSelectedScope(scope.id)}
                        className={`text-left p-4 border-2 transition-all duration-200 flex items-start gap-4 ${
                          selectedScope === scope.id 
                            ? "bg-[#ff6b00] border-[#ff6b00] text-black font-black" 
                            : "bg-transparent border-white/20 text-white/80 hover:border-white/50"
                        }`}
                      >
                        <span className="opacity-50">[{scope.id}]</span>
                        <span className="uppercase">{scope.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-6 mt-auto">
                    <p className="text-[#00ff41] text-sm md:text-base mb-2 font-bold">neuralforge@hub:~$ <span className="text-white font-normal">set_parameter --budget</span></p>
                  </div>

                  {/* Budgets */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    {BUDGETS.map(budget => (
                      <button
                        key={budget}
                        onClick={() => setSelectedBudget(budget)}
                        className={`px-6 py-3 border-2 uppercase font-bold text-sm tracking-widest transition-all ${
                          selectedBudget === budget
                            ? "bg-white border-white text-black"
                            : "bg-transparent border-white/20 text-white/80 hover:border-white/50"
                        }`}
                      >
                        {formatBudget(budget)}
                      </button>
                    ))}
                  </div>

                  {selectedBudget === "CUSTOM" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-12">
                      <input 
                        type="text" 
                        placeholder="ENTER CUSTOM ALLOCATION..." 
                        value={customBudget}
                        onChange={(e) => setCustomBudget(e.target.value)}
                        className="w-full bg-black border-2 border-[#ff6b00] text-[#ff6b00] p-4 font-bold tracking-widest focus:outline-none placeholder:text-[#ff6b00]/30"
                      />
                    </motion.div>
                  )}
                  {selectedBudget !== "CUSTOM" && <div className="mb-12" />}

                  <div className="flex justify-end mt-auto border-t border-white/10 pt-6">
                    <button
                      onClick={handleExecute}
                      disabled={!selectedScope || !selectedBudget}
                      className="px-8 py-4 bg-[#00ff41] text-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-[#00ff41]"
                    >
                      [CONTINUE] <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "form" && (
                <motion.div 
                  key="form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col h-full"
                >
                  <div className="mb-6">
                    <p className="text-[#00ff41] text-sm md:text-base mb-2 font-bold">neuralforge@hub:~$ <span className="text-white font-normal">provide_details --client</span></p>
                    <p className="text-white/60 text-xs mt-2 uppercase tracking-widest border-l-2 border-[#ff6b00] pl-3">
                      Enter payload context below:
                    </p>
                  </div>

                  <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 mb-8">
                    <input 
                      type="text" 
                      placeholder="COMMANDER_NAME" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/30"
                    />
                    <input 
                      type="email" 
                      placeholder="SECURE_UPLINK (EMAIL)" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/30"
                    />
                    <textarea 
                      placeholder="PROJECT_PARAMETERS (DETAILS)..." 
                      required
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      className="bg-transparent border border-white/20 text-white p-4 focus:outline-none focus:border-[#ff6b00] transition-colors placeholder:text-white/30 resize-none"
                    />

                    {/* TERMINAL CAPTCHA */}
                    <div className="mt-4 border-2 border-[#00ff41]/30 p-4 bg-[#00ff41]/5 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <p className="text-[#00ff41] font-bold text-xs uppercase tracking-widest">
                          [SECURITY OVERRIDE] SYSTEM.CALCULATE
                        </p>
                        <p className="text-white/70 text-sm mt-1">
                          Solve equation: {captchaParams.v1} + {captchaParams.v2} = ?
                        </p>
                      </div>
                      <input 
                        type="number"
                        required
                        placeholder="?"
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        className="bg-black border border-[#00ff41] text-[#00ff41] font-bold text-center w-24 p-3 focus:outline-none focus:bg-[#00ff41] focus:text-black transition-colors"
                      />
                    </div>
                  </form>

                  <div className="flex justify-between mt-auto border-t border-white/10 pt-6">
                    <button
                      onClick={() => setStep("input")}
                      className="px-6 py-4 bg-transparent border border-white/20 text-white/60 font-bold uppercase tracking-widest hover:border-white hover:text-white transition-colors"
                    >
                      [BACK]
                    </button>
                    <button
                      onClick={handleSubmitForm}
                      disabled={!formData.name || !formData.email || !formData.details || !captchaInput}
                      className="px-8 py-4 bg-[#ff6b00] text-black font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white transition-colors disabled:opacity-30 disabled:hover:bg-[#ff6b00]"
                    >
                      [DEPLOY PAYLOAD] <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "loading" && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6 m-auto"
                >
                  <Loader2 className="w-12 h-12 text-[#ff6b00] animate-spin mx-auto" />
                  <div>
                    <p className="text-[#00ff41] font-bold uppercase mb-2">Executing Pipeline...</p>
                    <p className="text-white/50 text-xs">Transmitting payload to backend nodes.</p>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col h-full justify-center"
                >
                  <div className="bg-[#00ff41]/10 border-l-4 border-[#00ff41] p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Check className="w-6 h-6 text-[#00ff41]" />
                      <h3 className="text-xl font-black text-[#00ff41] uppercase">Payload Received.</h3>
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm">
                      Your project parameters have been injected into our queue. A primary engineer will contact you shortly to initialize phase one.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 font-mono text-xs text-white/50 space-y-2 mb-10">
                    <p>{">"} SCOPE ID: {selectedScope}</p>
                    <p>{">"} BUDGET PARAM: {selectedBudget}</p>
                    <p>{">"} TIMESTAMP: {new Date().toISOString()}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep("input")}
                      className="px-6 py-3 border border-white/20 text-white hover:bg-white/10 uppercase tracking-widest text-xs font-bold"
                    >
                      Reset Console
                    </button>
                    <a href="https://calendly.com" target="_blank" className="px-6 py-5 bg-[#ff6b00] text-black font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-colors flex-1 text-center shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                      [ SCHEDULE DEPLOYMENT BRIEFING ]
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-[#1a1a1a] px-6 py-3 border-t border-black text-[10px] text-white/30 uppercase tracking-widest flex justify-between">
            <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> SECURE UPLINK</span>
            <span className="flex items-center gap-2"><Zap className="w-3 h-3" /> LATENCY: 24ms</span>
          </div>
        </div>
      </motion.div>

    </main>
  );
}