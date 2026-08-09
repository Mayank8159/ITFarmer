"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Zap } from "lucide-react";

const FAQS = [
  {
    question: "Who is Neural Forge for?",
    answer: "Neural Forge is designed for enterprise engineering teams, AI researchers, and funded startups who require uncompromised performance, strict security, and air-gapped deployments for their autonomous agents."
  },
  {
    question: "Do you offer managed hosting or raw compute?",
    answer: "We offer both. You can deploy directly to our bare-metal GPU clusters via our CLI, or leverage our managed Swarm Intelligence layer where our agents handle load balancing and deployment logic."
  },
  {
    question: "Is the infrastructure truly air-gapped?",
    answer: "Yes. Our enterprise tier provides physically isolated hardware with zero external telemetry, ensuring your proprietary models and datasets remain completely secure."
  },
  {
    question: "How does the pricing scale?",
    answer: "Pricing is completely transparent and based on raw compute cycles (PFLOPs) and network egress. There are no hidden fees for agent orchestration."
  },
  {
    question: "Can we fine-tune models directly on the platform?",
    answer: "Absolutely. Our pipeline supports LoRA and full-parameter fine-tuning directly on our GPU clusters, with isolated secure storage for your checkpoints."
  },
  {
    question: "Is there a limit to the number of agents in a swarm?",
    answer: "Technically, no. The swarm dynamically scales based on your compute allocation. We've seen swarms of over 10,000 sub-agents operating concurrently."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="relative w-full bg-[#f0f0f0] border-t-2 border-black py-24 z-10">
      <div className="max-w-[1600px] mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Title */}
          <div className="lg:w-1/3">
            <div className="border-2 border-black bg-white p-8 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative group cursor-crosshair hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-black leading-[0.8] mb-6">
                FAQ
              </h2>
              <div className="font-mono text-sm text-black/70 font-bold flex gap-4 items-start">
                <div className="w-2 h-2 bg-[#ff6b00] mt-1.5 flex-shrink-0" />
                <p>
                  Most Common Questions<br/>
                  <span className="opacity-60 font-normal mt-2 block">No worries, here you can find all the answers.</span>
                </p>
              </div>
              {/* Corner decor */}
              <div className="absolute top-2 right-2 w-2 h-2 border border-black/30" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border border-black/30" />
            </div>
            
            {/* Brutalist Decorative element */}
            <div className="flex w-24 h-24 sm:w-32 sm:h-32 border-2 border-black relative bg-[#111] items-center justify-center overflow-hidden shrink-0 mt-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-0 border-[8px] border-dashed border-[#ff6b00]/30 rounded-full scale-[1.5]"
              />
              <Zap className="w-8 h-8 sm:w-12 sm:h-12 text-[#ff6b00] relative z-10" />
            </div>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:w-2/3 border-t-2 border-black flex flex-col gap-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-black">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="border-b-2 border-black bg-white group hover:bg-[#f8f8f8] transition-colors last:border-b-0">
                <button 
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                >
                  <span className={`font-mono text-sm md:text-base font-bold uppercase max-w-[80%] leading-relaxed transition-colors ${openIndex === idx ? 'text-[#ff6b00]' : 'text-black group-hover:text-[#ff6b00]'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 border-2 flex items-center justify-center transition-all ${openIndex === idx ? 'bg-black text-white border-black rotate-180' : 'bg-[#ff6b00] text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-y-[-2px] group-hover:translate-x-[-2px] group-hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'}`}>
                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </button>
                
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 md:p-8 pt-0 font-mono text-sm text-black/70 leading-relaxed mx-6 md:mx-8 mb-6 border-l-4 border-[#ff6b00] bg-[#f0f0f0] shadow-inner">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
