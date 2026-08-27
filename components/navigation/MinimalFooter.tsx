import React from "react";
import { Terminal } from "lucide-react";

export default function MinimalFooter() {
  return (
    <footer className="w-full bg-[#0a0a0a] border-t-4 border-[#ff6b00] py-12 px-6 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 flex items-center justify-center mb-6 relative overflow-hidden rounded-full ring-2 ring-[#ff6b00]/50 shadow-[0_0_15px_rgba(255,107,0,0.5)] bg-black">
        <img src="/logo.jpg?v=2" alt="Neural Forge Hub Logo" className="w-full h-full object-cover rounded-full" />
      </div>
      <p className="text-white/50 font-mono text-xs uppercase tracking-widest mb-4">
        © {new Date().getFullYear()} Neural Forge Hub. All Rights Reserved.
      </p>
      <a href="mailto:services@neuralforgehub.tech" className="text-[#ff6b00] font-mono text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
        services@neuralforgehub.tech
      </a>
    </footer>
  );
}
