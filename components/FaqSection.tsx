"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const fallbackFaqs = [
  {
    question: "How fast can you assemble a squad?",
    answer: "Within 72 hours. Our network maintains a pre-vetted pool of elite engineers ready to deploy immediately into your specific domain."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data/faqContent')
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error loading FAQs:", err);
        setFaqs(fallbackFaqs);
        setIsLoading(false);
      });
  }, []);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-6 z-10 relative">
      <div className="text-center mb-16">
        <h2 className="text-[#FFD700] font-mono text-xs uppercase tracking-[0.4em] mb-4">Intelligence Base</h2>
        <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6 text-white font-serif">
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#B8860B]">Questions.</span>
        </h3>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center text-white/50 animate-pulse font-mono text-sm py-12">Loading FAQs...</div>
        ) : (
          faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.id || idx} className="border border-white/10 rounded-2xl bg-[#0a0e27]/40 backdrop-blur-md overflow-hidden transition-colors hover:border-white/20">
                <button
                  onClick={() => toggleOpen(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between"
                >
                  <span className={`text-sm md:text-base font-bold tracking-wide transition-colors ${isOpen ? "text-[#FFD700]" : "text-white"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 ml-4 ${isOpen ? "bg-[#FFD700]/10 text-[#FFD700]" : "bg-white/5 text-zinc-400"}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-[#E5E4E2]/70 font-light text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
