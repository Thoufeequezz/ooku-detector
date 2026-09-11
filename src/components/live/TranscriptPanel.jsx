import React from 'react';
import { MessageSquare, Radio, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export function TranscriptPanel({
  transcripts = [],
  onSimulate
}) {
  return (
    <Card
      title="Live Speech Transcript"
      subtitle="Raw speech-to-text feed"
      icon={MessageSquare}
      className="h-full flex flex-col min-h-[380px]"
      action={
        <Button
          variant="outline"
          size="sm"
          icon={Plus}
          onClick={onSimulate}
        >
          Simulate Speech Line
        </Button>
      }
    >
      {transcripts.length === 0 ? (
        /* Clean empty placeholder state */
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-3">
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-600">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <p className="text-sm font-mono font-medium text-slate-400">
            Waiting for conversation...
          </p>
          <p className="text-xs max-w-xs text-slate-600 font-sans">
            Spoken speech will be converted to text and stream here in real time.
          </p>
        </div>
      ) : (
        /* Spoken Dialogue List */
        <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
          {transcripts.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-cyan-400 font-mono">{item.speaker}</span>
                <span className="text-[10px] font-mono text-slate-500">{item.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200">"{item.text}"</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
