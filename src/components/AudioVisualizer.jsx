import React from 'react';

export function AudioVisualizer({ isListening }) {
  const bars = [40, 70, 30, 90, 50, 80, 60, 100, 45, 85, 35, 75, 50, 95, 65];

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="text-xs font-mono text-slate-400">Audio Stream Waveform</span>
      </div>

      <div className="flex items-center gap-1.5 h-8">
        {bars.map((height, i) => (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${
              isListening ? 'bg-gradient-to-t from-cyan-500 to-purple-500 animate-pulse' : 'bg-slate-700 h-2'
            }`}
            style={{
              height: isListening ? `${height}%` : '8px',
              animationDelay: `${i * 0.15}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}
