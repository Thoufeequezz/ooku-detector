import React from 'react';

export function Card({
  children,
  title,
  subtitle,
  icon: Icon,
  action,
  className = '',
  footer,
  hasCorners = true,
  interactive = false,
  ...props
}) {
  return (
    <div 
      className={`cyber-glass rounded-2xl p-5 border border-slate-800/80 ${hasCorners ? 'cyber-corner' : ''} ${interactive ? 'cyber-glass-interactive' : ''} ${className}`}
      {...props}
    >
      {(title || Icon || action) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              {title && <h3 className="font-bold text-slate-200 text-sm tracking-wide">{title}</h3>}
              {subtitle && <p className="text-xs font-mono text-slate-400">{subtitle}</p>}
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}

      <div>{children}</div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-400">
          {footer}
        </div>
      )}
    </div>
  );
}
