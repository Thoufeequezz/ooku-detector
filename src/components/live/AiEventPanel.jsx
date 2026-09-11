import React from 'react';
import { Flame, Sparkles, Plus, Zap, Award } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export function AiEventPanel({
  aiEvents = [],
  onSimulate,
  isAnalyzing = false
}) {
  return (
    <Card
      title="AI Ooku Classification Engine"
      subtitle="Structured Malayalam / Manglish Roast Analytics"
      icon={Flame}
      className="h-full flex flex-col min-h-[380px]"
      action={
        <Button
          variant="danger"
          size="sm"
          icon={Plus}
          disabled={isAnalyzing}
          onClick={onSimulate}
        >
          {isAnalyzing ? "Analyzing..." : "Simulate Ooku Event"}
        </Button>
      }
    >
      {aiEvents.length === 0 ? (
        /* Clean empty placeholder state */
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600">
            <Sparkles className="w-8 h-8 animate-pulse text-amber-500/50" />
          </div>
          <p className="text-sm font-mono font-medium text-slate-400">
            Waiting for AI roast detection...
          </p>
          <p className="text-xs max-w-xs text-slate-600 font-sans">
            AI language model will classify Malayalam/Manglish Ookus and return structured JSON telemetry.
          </p>
        </div>
      ) : (
        /* AI Ooku Events List */
        <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
          {aiEvents.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/60 border border-rose-500/30 shadow-lg space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="rose" icon={Award}>
                    {item.reaction || "Direct Hit"}
                  </Badge>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {item.roastType || "PLAYFUL_ROAST"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="amber" icon={Zap}>
                    {item.intensity}% Intensity
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono flex justify-between">
                <span>Target: <strong className="text-cyan-300">{item.speaker}</strong></span>
                <span>Confidence: <strong className="text-emerald-400">{Math.round((item.confidence || 0.9) * 100)}%</strong></span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <p className="text-xs italic text-slate-300">
                  "{item.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
