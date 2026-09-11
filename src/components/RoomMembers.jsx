import React from 'react';
import { Users, User, X } from 'lucide-react';

export function RoomMembers({ members = [], onClose }) {
  return (
    <div className="absolute top-14 left-4 z-50 w-56 cyber-glass rounded-2xl border border-slate-700 shadow-2xl p-4 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>ONLINE ({members.length})</span>
        </span>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {members.map((name, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs font-mono text-slate-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <User className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{typeof name === 'string' ? name : name.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
