import React from 'react';
import { Mic, MicOff, Play } from 'lucide-react';

export function MicControl({ isListening, onToggle, onNextRoast }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
            isListening 
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 scale-105' 
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
          title={isListening ? "Stop Mic" : "Start Mic"}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 animate-pulse" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>

        <div>
          <h3 className="font-bold text-slate-200 text-sm">
            {isListening ? 'Eavesdropping Active' : 'Microphone Standby'}
          </h3>
          <p className="text-xs text-slate-400">
            {isListening 
              ? 'Simulating real-time Malayalam speech recognition...' 
              : 'Click mic button to start automated Ooku detection.'}
          </p>
        </div>
      </div>

      <button
        onClick={onNextRoast}
        className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
      >
        <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
        <span>Simulate Next Ooku</span>
      </button>
    </div>
  );
}
