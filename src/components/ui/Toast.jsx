import React from 'react';
import { AlertCircle, CheckCircle2, Flame, X } from 'lucide-react';

export function Toast({
  isOpen = false,
  onClose,
  title,
  message,
  type = 'rose',
  actionLabel,
  onAction
}) {
  if (!isOpen) return null;

  const icons = {
    rose: Flame,
    cyan: AlertCircle,
    emerald: CheckCircle2,
  };

  const Icon = icons[type] || Flame;

  const borderStyles = {
    rose: 'border-rose-500/50 shadow-rose-500/10 text-rose-300',
    cyan: 'border-cyan-500/50 shadow-cyan-500/10 text-cyan-300',
    emerald: 'border-emerald-500/50 shadow-emerald-500/10 text-emerald-300',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 max-w-md w-full cyber-glass rounded-2xl p-4 border shadow-2xl transition-all duration-300 flex items-start gap-3.5 ${borderStyles[type]}`}>
      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
        <Icon className="w-5 h-5 animate-pulse" />
      </div>

      <div className="flex-1 pr-2">
        {title && <h4 className="text-sm font-bold text-slate-100">{title}</h4>}
        {message && <p className="text-xs font-mono text-slate-300 mt-0.5">{message}</p>}

        {actionLabel && (
          <button
            onClick={onAction}
            className="mt-2 text-xs font-mono font-bold underline hover:opacity-80 transition-opacity cursor-pointer"
          >
            {actionLabel}
          </button>
        )}
      </div>

      <button
        onClick={onClose}
        className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
