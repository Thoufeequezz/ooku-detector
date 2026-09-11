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
    <div className="p-6 rounded-2xl cyber-glass border border-cyan-500/40 text-center space-y-3 relative overflow-hidden">
      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
        YOUR ROOM CODE
      </span>

      <div className="flex items-center justify-center gap-3">
        <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-widest selection:bg-cyan-500">
          {code}
        </span>
        <button
          onClick={handleCopy}
          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-400 hover:text-white transition-colors cursor-pointer"
          title="Copy room code"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      <p className="text-xs font-mono text-slate-400">
        Share this code with your friends to let them join your chat room.
      </p>
    </div>
  );
}
