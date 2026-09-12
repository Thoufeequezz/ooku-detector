import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function RoomCode({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl cyber-glass border-2 border-cyan-500/40 text-center space-y-4 relative overflow-hidden shadow-2xl">
      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block">
        ROOM CODE
      </span>

      <div className="text-4xl sm:text-6xl font-black font-mono text-white tracking-widest selection:bg-cyan-500 py-1">
        {code}
      </div>

      <button
        onClick={handleCopy}
        className={`w-full py-4 px-6 rounded-2xl font-mono font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-lg ${
          copied
            ? 'bg-emerald-600 text-white border border-emerald-400'
            : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-5 h-5 text-white" />
            <span>✓ COPIED</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5 text-white" />
            <span>COPY CODE</span>
          </>
        )}
      </button>

      <p className="text-xs font-mono text-slate-400">
        Share this code with your friends.
      </p>
    </div>
  );
}
