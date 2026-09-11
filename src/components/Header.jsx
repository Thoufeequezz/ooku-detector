import React from 'react';
import { Radio, Flame, Sparkles } from 'lucide-react';
import { APP_NAME, APP_VERSION, HACKATHON_TAG } from '../utils/constants';

export function Header({ isListening }) {
  return (
    <header className="glass-panel border-b border-slate-800 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 via-purple-600 to-cyan-500 p-[2px] shadow-lg shadow-rose-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {APP_NAME}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                {APP_VERSION}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Malayalam/Manglish Roast Detector
            </p>
          </div>
        </div>

        {/* Hackathon Badge & Live Status */}
        <div className="flex items-center gap-4">
          <span className="hidden md:inline-flex items-center text-xs font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
            🏆 {HACKATHON_TAG}
          </span>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-300 ${
            isListening 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/20' 
              : 'bg-slate-800/60 text-slate-400 border-slate-700'
          }`}>
            <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>{isListening ? 'MIC ACTIVE' : 'MIC PAUSED'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
