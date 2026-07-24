"use client";

import React, { useState, JSX } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Calendar, Clock, ShieldCheck } from "lucide-react";

import TopBrandHeader from "@/components/TopBrandHeader";
import SideNav from "@/components/SideNav";
import OrbitChat from "@/components/orbit/OrbitChat";
import SmokeBackground from "@/components/SmokeBackground";
import { submitInquiry } from "@/app/actions/adminActions";

export default function ServicesPage(): JSX.Element {
  return (
      <main className="relative min-h-screen bg-transparent text-white selection:bg-[#FFD700]/30 overflow-x-hidden font-sans">
        <SmokeBackground />
        
        <div className="relative z-10">
          <TopBrandHeader />
      <SideNav />
          <OrbitChat />

          <section className="pt-32 px-6 text-center">
             <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-white">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Capabilities.</span>
             </h1>
          </section>

          <InquirySection />

          <footer className="py-12 text-center border-t border-white/5 text-[10px] font-mono text-[#E5E4E2]/40 uppercase tracking-[0.5em]">
            © 2026 IT FARM GLOBAL DELIVERY NETWORK.
          </footer>
        </div>
      </main>
  );
}

function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    if (captchaVerified) return;
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCaptchaVerified(true);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await submitInquiry(data);

      if (response.success) {
        setIsSuccess(true);
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error(response.error || "Transmission failed. Please verify connection.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="inquiry" className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter mb-4 text-white">Initialize Project</h2>
          <p className="text-[#E5E4E2]/70 font-light">Schedule a briefing with our architecture team.</p>
        </div>

        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="bg-[#0a0e27]/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] space-y-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {!isSuccess ? (
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Name" name="name" placeholder="John Doe" type="text" required />
                <InputGroup label="Company" name="company" placeholder="Acme Inc." type="text" />
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <InputGroup label="Email" name="email" placeholder="john@acme.com" type="email" required />
                <InputGroup label="Budget" name="budget" placeholder="₹20k — ₹1L+" type="text" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-[#E5E4E2]/50">Scheduling Protocol</label>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <Calendar className="absolute left-0 bottom-3 w-4 h-4 text-zinc-500 group-focus-within:text-[#FFD700] transition-colors" />
                    <input 
                      type="date" 
                      name="date" 
                      required
                      className="w-full bg-transparent border-b border-white/20 py-2 pl-7 text-white focus:outline-none focus:border-[#FFD700] transition-colors uppercase text-xs font-mono [color-scheme:dark]"
                    />
                  </div>
                  <div className="relative group">
                    <Clock className="absolute left-0 bottom-3 w-4 h-4 text-zinc-500 group-focus-within:text-[#FFD700] transition-colors" />
                    <input 
                      type="time" 
                      name="time" 
                      required
                      className="w-full bg-transparent border-b border-white/20 py-2 pl-7 text-white focus:outline-none focus:border-[#FFD700] transition-colors uppercase text-xs font-mono [color-scheme:dark]"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-widest text-[#E5E4E2]/50">Service Required</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Software", "AI/ML", "SaaS", "Security", "Design", "Other"].map((opt) => (
                    <label key={opt} className="cursor-pointer group">
                      <input type="radio" name="service" value={opt} className="peer sr-only" required />
                      <div className="px-4 py-3 rounded-xl bg-[#020202] border border-white/10 text-[#E5E4E2]/50 text-sm text-center peer-checked:bg-[#FFD700]/10 peer-checked:text-[#FFD700] peer-checked:border-[#FFD700]/50 transition-all group-hover:border-white/30">
                        {opt}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-[#E5E4E2]/50">Mission Brief</label>
                <textarea 
                  name="message"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FFD700] transition-colors resize-none h-24 text-sm font-light"
                  placeholder="Tell us about your mission..."
                />
              </div>

              {/* CAPTCHA VERIFICATION */}
              <div className="flex items-center justify-between p-4 bg-[#020202]/80 border border-white/10 rounded-2xl w-full max-w-sm mx-auto backdrop-blur-md mt-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleVerify}
                    type="button"
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-all ${captchaVerified ? "bg-[#FFD700] border-[#FFD700]" : "border-white/30 hover:border-[#FFD700]"}`}
                  >
                    {isVerifying && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                    {captchaVerified && !isVerifying && <CheckCircle className="w-4 h-4 text-black" />}
                  </button>
                  <span className={`text-xs font-mono uppercase tracking-widest ${captchaVerified ? "text-[#FFD700]" : "text-[#E5E4E2]/70"}`}>
                    {captchaVerified ? "Humanity Verified" : "Verify Humanity"}
                  </span>
                </div>
                <ShieldCheck className={`w-5 h-5 ${captchaVerified ? "text-[#FFD700]" : "text-zinc-600"}`} />
              </div>

              {error && <p className="text-red-500 text-[10px] font-mono uppercase tracking-widest text-center mt-4">{error}</p>}

              <button 
                disabled={isSubmitting || !captchaVerified}
                className="w-full py-5 bg-white text-[#0a0e27] font-black uppercase tracking-widest text-xs hover:bg-gradient-to-r hover:from-[#FFD700] hover:to-[#B8860B] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 mt-8 active:scale-95 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] border border-transparent hover:border-[#FFD700]/30"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initiate Briefing"}
              </button>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-[#FFD700]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#FFD700]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 uppercase italic tracking-tighter">Transmission Successful</h3>
              <p className="text-[#E5E4E2]/70 text-sm font-light">Our commanders have received your mission brief. Expect a response shortly.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-8 text-[10px] text-[#E5E4E2]/50 hover:text-[#FFD700] transition-colors uppercase font-mono tracking-widest underline underline-offset-4">Send New Brief</button>
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}

function InputGroup({ label, placeholder, type, name, required }: any) {
  return (
    <div className="flex flex-col gap-2 relative group">
      <label className="text-xs font-mono uppercase tracking-widest text-[#E5E4E2]/50 group-focus-within:text-[#FFD700] transition-colors">{label}</label>
      <input 
        name={name}
        type={type} 
        required={required}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/20 py-2 text-white placeholder:text-zinc-700 focus:outline-none focus:border-[#FFD700] transition-colors w-full text-sm font-light"
      />
    </div>
  );
}