import React from 'react';
import crypto from 'crypto';

export default function SystemTelemetryFallback() {
  const region = process.env.VERCEL_REGION || "LOCAL-DEV-NODE";
  const memory = process.memoryUsage();
  const heapUsed = (memory.heapUsed / 1024 / 1024).toFixed(2);
  const traceId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  return (
    <div className="flex-1 border-r-2 border-black/30 p-6 flex flex-col font-mono relative z-10 bg-black/40 h-full w-full">
      <div className="flex items-center gap-3 mb-6 border-b border-white/20 pb-4">
        <div className="w-3 h-3 bg-[#ff6b00] animate-pulse" />
        <span className="text-white text-sm font-bold tracking-widest uppercase">NODE TELEMETRY ACTIVE</span>
      </div>
      
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">SERVER_REGION:</span>
          <span className="text-[#00ff41] font-bold">{region}</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">HEAP_ACTIVE:</span>
          <span className="text-white">{heapUsed} MB</span>
        </div>
        <div className="flex justify-between border-b border-white/10 pb-2">
          <span className="text-white/50">SYS_TIME:</span>
          <span className="text-white text-xs">{timestamp}</span>
        </div>
        <div className="flex justify-between pb-2">
          <span className="text-white/50">TRACE_ID:</span>
          <span className="text-white text-[10px] break-all">{traceId}</span>
        </div>
      </div>
      <div className="mt-auto pt-4 text-[10px] text-white/30 uppercase text-center border-t border-white/10">
        Dynamic System State Confirmed
      </div>
    </div>
  );
}
