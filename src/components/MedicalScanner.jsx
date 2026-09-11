import React, { useEffect, useState } from 'react';
import { Activity, Skull, CheckCircle2 } from 'lucide-react';

export function MedicalScanner({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDone(true);
          if (onComplete) setTimeout(onComplete, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="cyber-glass rounded-3xl p-6 sm:p-8 border border-purple-500/30 text-center space-y-4 shadow-2xl">
      <div className="flex items-center justify-center gap-2 font-mono text-xs font-extrabold text-purple-300 uppercase tracking-widest">
        <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
        <span>FRIENDSHIP TELEMETRY SCANNER</span>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between text-xs font-mono text-slate-300">
          <span>Analyzing friendship stability...</span>
          <span className="font-bold text-cyan-300">{progress}%</span>
        </div>

        {/* Progress bar container */}
        <div className="h-3.5 w-full bg-[#19192B] rounded-full overflow-hidden border border-purple-500/30 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF3B5C] rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-xs font-mono text-slate-400 flex items-center justify-center gap-1.5 pt-1">
        {isDone ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 font-bold">Diagnosis Complete 💀</span>
          </>
        ) : (
          <>
            <Skull className="w-4 h-4 text-rose-400 animate-bounce" />
            <span>Scanning emotional damage...</span>
          </>
        )}
      </div>
    </div>
  );
}
