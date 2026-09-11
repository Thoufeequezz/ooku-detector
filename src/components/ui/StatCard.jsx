import React from 'react';

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'cyan',
  className = ''
}) {
  const accentColors = {
    cyan: {
      border: 'hover:border-cyan-500/50',
      text: 'text-cyan-400',
      glow: 'shadow-cyan-500/10'
    },
    rose: {
      border: 'hover:border-rose-500/50',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/10'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/10'
    },
    purple: {
      border: 'hover:border-purple-500/50',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/10'
    }
  };

  const currentAccent = accentColors[color] || accentColors.cyan;

  return (
    <div className={`cyber-glass rounded-2xl p-5 border border-slate-800/80 transition-all duration-300 ${currentAccent.border} ${currentAccent.glow} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800 ${currentAccent.text}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Large KPI Value display for projector visibility */}
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className={`text-3xl md:text-4xl font-extrabold font-mono tracking-tight ${currentAccent.text}`}>
          {value}
        </div>
        {trend && (
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs font-mono text-slate-500 mt-2">
          {subtext}
        </p>
      )}
    </div>
  );
}
