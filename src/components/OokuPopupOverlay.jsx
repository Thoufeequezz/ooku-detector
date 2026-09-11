import React, { useEffect, useState } from 'react';
import { Flame, Skull, Zap, AlertTriangle, ShieldAlert } from 'lucide-react';

export function OokuPopupOverlay({ event, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, 2400);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!event || !visible) return null;

  const intensity = Number(event.intensity) || 7;
  const damage = Number(event.damage) || (intensity * 10);
  const isCounter = event.type === 'COUNTER_OOKU';

  let title = "OOKU DETECTED";
  let badgeText = "DIRECT HIT 🔥";
  let quote = "Eda mone... ithu personal aanu.";
  let Icon = Flame;
  let bgGradient = "from-rose-950/95 via-rose-900/90 to-slate-950/95 border-rose-500/60 text-rose-200 shadow-rose-500/30";

  if (isCounter) {
    title = "COUNTER OOKU 🛡️";
    badgeText = "RETALIATION 🔥";
    quote = "Aaha, innale thottavane innu upadesham parayunnu!";
    Icon = Zap;
    bgGradient = "from-amber-950/95 via-amber-900/90 to-slate-950/95 border-amber-500/60 text-amber-200 shadow-amber-500/30";
  } else if (intensity >= 9) {
    title = "☠️ CRITICAL OOKU";
    badgeText = "MAXIMUM DAMAGE 🔥";
    quote = "Ninte coding kandittu server crashed... someone check on him! 💀";
    Icon = Skull;
    bgGradient = "from-rose-950/95 via-purple-950/95 to-slate-950/95 border-rose-500/80 text-rose-100 shadow-rose-600/40";
  } else if (intensity >= 7) {
    title = "💀 HEAVY OOKU";
    badgeText = "DIRECT HIT 🔥";
    quote = "Eda mone... ithu personal aanu.";
    Icon = Skull;
    bgGradient = "from-rose-950/95 via-slate-900/95 to-rose-950/95 border-rose-500/60 text-rose-200 shadow-rose-500/30";
  } else if (intensity >= 5) {
    title = "😂 MEDIUM OOKU";
    badgeText = "THAT ONE LANDED";
    quote = "That one hit right on target!";
    Icon = AlertTriangle;
    bgGradient = "from-amber-950/95 via-slate-900/95 to-amber-950/95 border-amber-500/50 text-amber-200 shadow-amber-500/20";
  } else {
    title = "😏 LIGHT OOKU";
    badgeText = "SMALL DAMAGE";
    quote = "Small damage... we'll allow it.";
    Icon = Flame;
    bgGradient = "from-slate-900/95 via-cyan-950/90 to-slate-900/95 border-cyan-500/40 text-cyan-200 shadow-cyan-500/20";
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Background impact flash */}
      <div className="absolute inset-0 bg-rose-500/10 animate-impact-flash" />

      {/* Main Popup Overlay Card */}
      <div className={`relative max-w-md w-full p-6 sm:p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-xl text-center space-y-4 animate-popup-pop bg-gradient-to-b ${bgGradient}`}>
        {/* Animated Icon Badge */}
        <div className="inline-flex p-4 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
          <Icon className="w-10 h-10 animate-bounce text-rose-400" />
        </div>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">
            💀 {title} 💀
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
            {badgeText}
          </h2>
        </div>

        {/* Damage Box */}
        <div className="inline-block px-5 py-2.5 rounded-2xl bg-black/60 border border-white/15 text-center shadow-lg">
          <span className="text-xs font-mono text-slate-400 block font-semibold">DAMAGE</span>
          <span className="text-3xl sm:text-4xl font-extrabold font-mono text-rose-400">
            {damage}
          </span>
        </div>

        {/* Quote */}
        <p className="text-base sm:text-lg italic font-medium text-slate-200 font-sans leading-relaxed pt-1">
          "{quote}"
        </p>

        {/* Speaker to Target */}
        <div className="pt-2 text-xs font-mono text-slate-400 flex items-center justify-center gap-2 border-t border-white/10">
          <span className="text-cyan-300 font-bold">{event.speaker || "Roaster"}</span>
          <span>💥 targeted</span>
          <span className="text-rose-300 font-bold">{event.target || "Friend"}</span>
        </div>
      </div>
    </div>
  );
}
