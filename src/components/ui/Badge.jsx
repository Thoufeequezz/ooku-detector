import React from 'react';

export function Badge({
  children,
  variant = 'cyan',
  pulse = false,
  className = '',
  icon: Icon
}) {
  const variants = {
    cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-500/30",
    rose: "bg-rose-950/60 text-rose-300 border-rose-500/30",
    amber: "bg-amber-950/60 text-amber-300 border-amber-500/30",
    emerald: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
    purple: "bg-purple-950/60 text-purple-300 border-purple-500/30",
    slate: "bg-slate-900 text-slate-400 border-slate-700"
  };

  const pulseColors = {
    cyan: "bg-cyan-400",
    rose: "bg-rose-400",
    amber: "bg-amber-400",
    emerald: "bg-emerald-400",
    purple: "bg-purple-400",
    slate: "bg-slate-400"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium tracking-wide ${variants[variant]} ${className}`}>
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant]}`} />
        </span>
      )}
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
