import React from 'react';

export function Button({
  children,
  variant = 'cyber',
  size = 'md',
  icon: Icon,
  isPulse = false,
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl select-none";

  const variants = {
    cyber: "bg-cyan-950/80 hover:bg-cyan-900/90 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95",
    danger: "bg-rose-950/80 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-500/20 active:scale-95",
    success: "bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95",
    ghost: "bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 active:scale-95",
    outline: "bg-transparent text-slate-300 border border-slate-700 hover:border-cyan-500/50 hover:text-cyan-300 active:scale-95"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs md:text-sm gap-2",
    lg: "px-6 py-3 text-sm md:text-base gap-2.5"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${isPulse ? 'animate-cyber-pulse' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className={`shrink-0 ${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      <span>{children}</span>
    </button>
  );
}
