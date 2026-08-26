"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Calendar, Clock, ArrowRight, Loader2, Check } from "lucide-react";
import { submitInquiry } from "@/app/actions/adminActions";

export default function CustomBookingForm() {
  const [step, setStep] = useState<"form" | "loading" | "success">("form");
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    date: "",
    time: "",
    details: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date || !formData.time) return;

    setStep("loading");
    setError(null);

    try {
      const result = await submitInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company || "N/A",
        service: "Strategy Call Booking",
        budget: "-",
        message: `Requested Date: ${formData.date}\nRequested Time: ${formData.time}\n\nDetails: ${formData.details}`,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });

      if (result.success) {
        setStep("success");
      } else {
        throw new Error(result.error || "Failed to secure booking.");
      }
    } catch (err: any) {
      setError(err.message || "A system error occurred.");
      setStep("form");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#0a0a0a] border-4 border-[#ff6b00] shadow-[16px_16px_0px_0px_rgba(255,107,0,0.3)] flex flex-col font-mono text-white relative">
      
      {/* Browser Header */}
      <div className="bg-[#1a1a1a] border-b-4 border-[#ff6b00] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 relative overflow-hidden bg-black border border-[#ff6b00]">
            <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-white/80">Strategy Call Scheduler</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <div className="p-8 md:p-12 flex-1 relative min-h-[400px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-8 border-l-2 border-[#ff6b00] pl-4">
                <p className="text-[#00ff41] font-bold text-sm uppercase tracking-widest">Execute: secure_timeslot.sh</p>
                <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">Provide coordinates for communication link.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00]">OPERATIVE NAME</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00]">SECURE EMAIL</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00]">ORGANIZATION / COMPANY</label>
                  <input 
                    type="text" 
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors"
                    placeholder="Optional"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00] flex items-center gap-2"><Calendar className="w-3 h-3"/> PREFERRED DATE</label>
                    <input 
                      type="date" 
                      required
                      value={formData.date}
                      onChange={e => setFormData({...formData, date: e.target.value})}
                      className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00] flex items-center gap-2"><Clock className="w-3 h-3"/> PREFERRED TIME</label>
                    <input 
                      type="time" 
                      required
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors [&::-webkit-calendar-picker-indicator]:invert"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-[#ff6b00]">MEETING AGENDA / DETAILS</label>
                  <textarea 
                    rows={3}
                    value={formData.details}
                    onChange={e => setFormData({...formData, details: e.target.value})}
                    className="bg-black border border-white/20 p-4 text-sm focus:outline-none focus:border-[#ff6b00] transition-colors resize-none"
                    placeholder="What are we discussing?"
                  />
                </div>

                {error && (
                  <div className="bg-red-500/10 border-l-4 border-red-500 text-red-500 p-4 text-xs uppercase tracking-widest font-bold">
                    [ERROR] {error}
                  </div>
                )}

                <button 
                  type="submit"
                  className="mt-4 bg-[#ff6b00] text-black font-black uppercase tracking-widest py-4 border-2 border-[#ff6b00] hover:bg-black hover:text-[#ff6b00] transition-all flex items-center justify-center gap-3 w-full"
                >
                  REQUEST MEETING <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-6"
            >
              <Loader2 className="w-12 h-12 text-[#ff6b00] animate-spin" />
              <div>
                <p className="text-[#00ff41] font-bold uppercase mb-2">Transmitting Request...</p>
                <p className="text-white/50 text-xs">Securing time slot in database.</p>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col justify-center h-full text-center items-center"
            >
              <div className="w-20 h-20 bg-[#00ff41]/20 border-2 border-[#00ff41] rounded-full flex items-center justify-center mb-6">
                <Check className="w-10 h-10 text-[#00ff41]" />
              </div>
              <h3 className="text-2xl font-black text-[#00ff41] uppercase mb-4">MEETING REQUEST SECURED</h3>
              <p className="text-white/80 leading-relaxed text-sm max-w-md mx-auto mb-8">
                Your preferred time has been logged in our system. A primary engineer will review the availability and send a calendar invite shortly to confirm the session.
              </p>
              <button 
                onClick={() => setStep("form")}
                className="text-[#ff6b00] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4"
              >
                Submit another request
              </button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}
