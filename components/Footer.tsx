"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Terminal, Instagram, Twitter, Linkedin, X } from "lucide-react";
import DistortedText from "@/components/DistortedText";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetch('/api/data/systemConfig')
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(err => console.error(err));
  }, []);

  const contact = config?.contact || {
    email: "services@neuralforgehub.tech",
    instagram: "#",
    twitter: "#",
    linkedin: "#"
  };

  return (
    <>
      <footer className="w-full bg-[#f0f0f0] border-t-4 border-black relative z-10">
        <div className="max-w-[1600px] mx-auto px-6 pt-20 pb-10">

          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

            {/* Brand Column */}
            <div className="col-span-2 md:col-span-2 flex flex-col items-start">
              <a href="/" className="flex items-center gap-3 mb-6 bg-black text-white px-4 py-2 hover:bg-[#ff6b00] transition-colors border border-black group">
                <div className="w-6 h-6 relative overflow-hidden rounded-full ring-2 ring-[#ff6b00]/30 shadow-[0_0_10px_rgba(255,107,0,0.4)] bg-black group-hover:ring-[#ff6b00] group-hover:shadow-[0_0_15px_rgba(255,107,0,0.8)] transition-all">
                  <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="font-bold tracking-tight uppercase">Neural Forge Hub</span>
              </a>
              <p className="text-black/70 text-sm font-mono leading-relaxed max-w-xs mb-6">
                We're the engineering team you wish you had in-house — we build production AI and software, not prototypes.
              </p>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black w-fit">
                <div className="w-2 h-2 bg-[#ff6b00]" />
                <span className="text-[10px] font-mono font-bold text-black uppercase tracking-widest">SYSTEMS OPERATIONAL</span>
              </div>
            </div>

            {/* Links Columns */}
            <div className="flex flex-col gap-4">
              <h4 className="text-black font-black text-sm mb-2 uppercase border-b border-black pb-2">EXPLORE</h4>
              <a href="/works" className="text-black/70 font-mono text-xs uppercase hover:text-[#ff6b00] transition-colors hover:pl-2">Work</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-black font-black text-sm mb-2 uppercase border-b border-black pb-2">COMPANY</h4>
              <a href="/about" className="text-black/70 font-mono text-xs uppercase hover:text-[#ff6b00] transition-colors hover:pl-2">About</a>
              <a href="/contact" className="text-black/70 font-mono text-xs uppercase hover:text-[#ff6b00] transition-colors hover:pl-2">Contact</a>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-black font-black text-sm mb-2 uppercase border-b border-black pb-2">SOCIAL</h4>
              <div className="flex gap-4">
                {contact.instagram && (
                  <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#ff6b00] transition-colors border border-black bg-white p-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {contact.twitter && (
                  <a href={contact.twitter} target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#ff6b00] transition-colors border border-black bg-white p-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {contact.linkedin && (
                  <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-black hover:text-[#ff6b00] transition-colors border border-black bg-white p-2 hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-black flex flex-col md:flex-row items-center justify-between gap-4 mb-16">
            <p className="text-black/60 text-xs font-mono font-bold">
              © 2026 NEURAL FORGE HUB. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 text-black/60 text-xs font-mono font-bold">
              <button onClick={() => setLegalModal('privacy')} className="hover:text-black transition-colors uppercase tracking-widest">PRIVACY POLICY</button>
              <button onClick={() => setLegalModal('terms')} className="hover:text-black transition-colors uppercase tracking-widest">TERMS OF SERVICE</button>
            </div>
          </div>

          {/* Extreme Footer Text Distortion */}
          <DistortedText text="FORGE" />
        </div>
      </footer>

      {/* Brutalist Legal Modal */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#e5e5e5] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[80vh] flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b-4 border-black bg-white">
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  {legalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
                </h2>
                <button
                  onClick={() => setLegalModal(null)}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-[#ff6b00] hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto font-mono text-sm leading-relaxed text-black/80">
                <p className="mb-4">
                  <strong>Effective Date: {new Date().toLocaleDateString()}</strong>
                </p>
                {legalModal === 'privacy' ? (
                  <>
                    <p className="mb-4">This Privacy Policy details how Neural Forge Hub ("we," "us," or "our") collects, uses, and protects your proprietary data and models.</p>
                    <p className="mb-4">1. <strong>Air-Gapped Telemetry:</strong> Enterprise clusters deployed via our platform default to a strict zero-telemetry protocol. No neural weights, gradients, or inference payloads are stored on edge nodes after processing.</p>
                    <p className="mb-4">2. <strong>Swarm Logs:</strong> Temporary logs generated by autonomous agents are cryptographically hashed and automatically purged after 24 hours.</p>
                    <p className="mb-4">3. <strong>Third-Party Processors:</strong> We do not sell or share computational usage metrics to external entities. Network bandwidth logs are kept purely for billing cycles.</p>
                  </>
                ) : (
                  <>
                    <p className="mb-4">These Terms of Service govern your access to the Neural Forge GPU clusters and Autonomous Swarm APIs.</p>
                    <p className="mb-4">1. <strong>Acceptable Use:</strong> Users are prohibited from deploying intelligent agents designed to orchestrate denial-of-service attacks, scrape copyrighted PII, or execute unauthorized smart contract exploits.</p>
                    <p className="mb-4">2. <strong>Compute Quotas:</strong> Intensive cluster tasks that exceed the PFLOP/s limit of your active tier will be dynamically throttled. We reserve the right to preempt idle instances to maintain network integrity.</p>
                    <p className="mb-4">3. <strong>Liability:</strong> Neural Forge Hub is not responsible for the downstream actions of autonomous agents you compile and deploy. The engineer assumes all liability for swarm behaviors.</p>
                  </>
                )}
                <div className="mt-8 pt-4 border-t-2 border-black/20 text-xs opacity-70">
                  By closing this window, you acknowledge and accept these terms as a binding protocol.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}