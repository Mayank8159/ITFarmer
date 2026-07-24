"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("ADMIN PANEL CRASHED:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center p-8 font-mono">
      <div className="bg-red-500/10 border border-red-500/30 rounded-3xl p-8 max-w-xl w-full flex flex-col items-center text-center space-y-6">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-red-400 uppercase tracking-widest mb-2">System Failure</h2>
          <p className="text-zinc-400 text-sm font-mono break-all">{error.message || "An unexpected runtime error occurred."}</p>
        </div>

        <button
          onClick={() => reset()}
          className="flex items-center gap-3 px-6 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-400 font-bold uppercase tracking-widest rounded-xl transition-colors text-sm"
        >
          <RotateCcw className="w-4 h-4" /> Attempt Reboot
        </button>
      </div>
    </div>
  );
}
