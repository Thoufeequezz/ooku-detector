import React from 'react';
import { MessageSquareQuote, Zap, Laugh } from 'lucide-react';

export function ReactionCard({ phrase }) {
  if (!phrase) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-rose-500/30 bg-slate-950/80 shadow-2xl relative overflow-hidden group">
      {/* Decorative Gradient Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500" />

      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl p-2 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
            {phrase.reactionEmoji || "🔥"}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold tracking-wider uppercase">
                {phrase.type || "OOKU REACTION"}
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {phrase.timestamp}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-300">
              Spoken by <span className="text-cyan-400 font-bold">{phrase.speaker}</span>
            </h4>
          </div>
        </div>

        <div className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-1 font-semibold">
          <Zap className="w-3 h-3 text-rose-400 fill-rose-400" />
          <span>{phrase.intensity}% Tease</span>
        </div>
      </div>

      {/* Spoken Speech Quote */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 mb-4">
        <div className="flex items-start gap-2 text-slate-400 text-xs font-mono mb-1">
          <MessageSquareQuote className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Detected Audio Transcript:</span>
        </div>
        <p className="text-sm italic font-medium text-slate-200 pl-6">
          "{phrase.text}"
        </p>
        {phrase.translated && (
          <p className="text-xs text-slate-400 pl-6 mt-1">
            ({phrase.translated})
          </p>
        )}
      </div>

      {/* AI Counter Roast Response */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 shadow-lg">
        <div className="flex items-center gap-2 mb-1">
          <Laugh className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold font-mono text-rose-300 uppercase tracking-wider">
            Friendship OS Counter Roast 🤖
          </span>
        </div>
        <p className="text-base font-bold text-white tracking-wide font-sans pl-6">
          "{phrase.roast}"
        </p>
      </div>
    </div>
  );
}
