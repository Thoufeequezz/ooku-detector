import React from 'react';
import { Flame, AlertTriangle } from 'lucide-react';
import { INTENSITY_LEVELS } from '../utils/constants';

export function OokuMeter({ intensity = 0 }) {
  let level = INTENSITY_LEVELS.LOW;
  if (intensity > 75) level = INTENSITY_LEVELS.HIGH;
  else if (intensity > 40) level = INTENSITY_LEVELS.MEDIUM;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: intensity > 75 ? 'rgb(244, 63, 94)' : intensity > 40 ? 'rgb(245, 158, 11)' : 'rgb(20, 184, 166)'
        }}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`w-5 h-5 ${level.text} animate-bounce`} />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide">Ooku Intensity Level</h3>
        </div>
        <span className={`text-xs font-bold font-mono px-2.5 py-1 rounded-full border ${
          intensity > 75 ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
          intensity > 40 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
          'bg-teal-500/20 text-teal-300 border-teal-500/40'
        }`}>
          {level.label}
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div 
          className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${level.color}`}
          style={{ width: `${intensity}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2 text-xs font-mono text-slate-400">
        <span>0% Chill</span>
        <span className="font-bold text-slate-200">{intensity}% Roasting</span>
        <span>100% Extreme</span>
      </div>
    </div>
  );
}
