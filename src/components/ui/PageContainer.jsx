import React from 'react';
import { Flame, Sparkles, Terminal } from 'lucide-react';
import { Badge } from './Badge';
import { APP_NAME, APP_VERSION, HACKATHON_TAG } from '../../utils/constants';

export function PageContainer({
  children,
  headerAction,
  activeStatus = "SYSTEM OPERATIONAL",
  isListening = false
}) {
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans relative overflow-x-hidden bg-grid-cyber selection:bg-rose-500 selection:text-white">
      {/* Top Subtle Radial Presentation Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial-glow pointer-events-none z-0" />

      {/* Top Desktop Navigation Header */}
      <header className="cyber-glass border-b border-slate-800/80 px-6 py-4 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight font-mono text-white">
                  {APP_NAME}
                </h1>
                <Badge variant="rose">{APP_VERSION}</Badge>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> Real-time Malayalam / Manglish Ooku Detector
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="purple" icon={Terminal}>
              {HACKATHON_TAG}
            </Badge>

            <Badge variant={isListening ? "emerald" : "slate"} pulse={isListening}>
              {isListening ? "EAVESDROPPING LIVE" : "MIC STANDBY"}
            </Badge>

            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      </header>

      {/* Main Hackathon Presentation Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        {children}
      </main>

      {/* Presentation Footer */}
      <footer className="border-t border-slate-900/80 py-4 px-6 text-center text-xs font-mono text-slate-500 relative z-10 bg-slate-950/60">
        Friendship OS • Hackathon Visual Presentation System • Most Useless Project 2026
      </footer>
    </div>
  );
}
