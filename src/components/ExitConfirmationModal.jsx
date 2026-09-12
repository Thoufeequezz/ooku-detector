import React from 'react';
import { LogOut, Flame, Trophy, ShieldAlert, Skull } from 'lucide-react';

export function ExitConfirmationModal({
  isOpen,
  onClose,
  onConfirmExit,
  currentDamage = 0,
  currentRank = '#1'
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#11111F] border-2 border-rose-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-950/50 text-white overflow-hidden animate-scale-up">
        {/* Background Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-500/40 text-rose-400">
            <LogOut className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white flex items-center gap-2">
              🚪 Leave the chaos?
            </h2>
            <p className="text-sm font-sans text-slate-400">
              Are you sure you want to leave this room?
            </p>
          </div>
        </div>

        {/* Current Score & Rank Card */}
        <div className="my-6 p-4 rounded-2xl bg-[#19192B] border border-purple-500/20 grid grid-cols-2 gap-4 text-center">
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30">
            <span className="block text-xs font-mono uppercase text-slate-400 tracking-wider mb-1 flex items-center justify-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Damage
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
              🔥 {currentDamage}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <span className="block text-xs font-mono uppercase text-slate-400 tracking-wider mb-1 flex items-center justify-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Rank
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
              {currentRank}
            </span>
          </div>
        </div>

        <p className="text-xs font-mono text-slate-400 mb-6 text-center leading-relaxed">
          ⚠️ Your final score will be saved on the room leaderboard. You won't be able to send new messages once you exit.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="w-full py-4 px-4 rounded-2xl font-black font-mono text-sm sm:text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Flame className="w-5 h-5 text-rose-300" /> STAY IN CHAOS
          </button>

          <button
            onClick={onConfirmExit}
            className="w-full py-4 px-4 rounded-2xl font-black font-mono text-sm sm:text-base bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Skull className="w-5 h-5 text-white" /> EXIT 💀
          </button>
        </div>
      </div>
    </div>
  );
}
