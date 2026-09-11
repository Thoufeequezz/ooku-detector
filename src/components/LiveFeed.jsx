import React from 'react';
import { History, Sparkles } from 'lucide-react';
import { getIntensityBadgeClass } from '../utils/formatters';

export function LiveFeed({ feed = [] }) {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col h-full min-h-[380px]">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <h3 className="font-semibold text-slate-200 text-sm">Live Roast Stream Log</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          {feed.length} events logged
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin scrollbar-thumb-slate-800">
        {feed.map((item, idx) => (
          <div 
            key={`${item.id}-${idx}`}
            className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-cyan-300 font-mono">{item.speaker}</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getIntensityBadgeClass(item.intensity)}`}>
                  {item.intensity}% Roast
                </span>
                <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-300 mb-1">"{item.text}"</p>
            
            {item.isOoku && (
              <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-medium text-rose-400">
                <Sparkles className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>{item.roast}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
