import React from 'react';
import { Skull, Flame } from 'lucide-react';

export function EndChatModal({
  isOpen = false,
  onClose,
  onConfirm
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="cyber-glass rounded-3xl border-2 border-rose-500/50 p-6 sm:p-8 shadow-2xl max-w-md w-full text-center space-y-5 animate-popup-pop">
        <div className="inline-flex p-4 rounded-2xl bg-rose-950/90 border border-rose-500/40 text-rose-400 shadow-lg shadow-rose-600/30">
          <Skull className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h3 className="text-3xl font-extrabold font-mono text-white tracking-tight">
            End the chaos? 💀
          </h3>
          <p className="text-sm font-mono text-slate-300">
            Are you sure? We were just getting started. 😭
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-1/2 h-[56px] rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono font-bold text-base flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <Flame className="w-5 h-5 text-amber-400" />
            <span>KEEP CHAOS 🔥</span>
          </button>

          <button
            onClick={onConfirm}
            className="w-full sm:w-1/2 h-[56px] rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-600/30 active:scale-95 transition-all cursor-pointer border border-rose-400/40"
          >
            <Skull className="w-5 h-5" />
            <span>END IT 💀</span>
          </button>
        </div>
      </div>
    </div>
  );
}
