import React, { useEffect, useState } from 'react';
import { Flame, Skull, Zap, AlertTriangle } from 'lucide-react';

export function OokuKillNotification({ event, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300);
    }, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!event || !visible) return null;

  const intensity = Number(event.intensity) || 7;
  const damage = Number(event.damage) || (intensity * 10);
  const isCounter = event.type === 'COUNTER_OOKU';

  let title = "OOKU DETECTED";
  let badgeText = "DIRECT HIT 🔥";
  let Icon = Flame;
  let bgGradient = "from-[#FF3B5C]/90 via-[#8B5CF6]/90 to-[#11111F]/95 border-rose-500/70 text-white shadow-rose-500/40";

  if (isCounter) {
    title = "COUNTER OOKU 🛡️";
    badgeText = "RETALIATION 🔥";
    Icon = Zap;
    bgGradient = "from-amber-600/90 via-[#8B5CF6]/90 to-[#11111F]/95 border-amber-500/70 text-white shadow-amber-500/40";
  } else if (intensity >= 9) {
    title = "☠️ CRITICAL OOKU";
    badgeText = "MAXIMUM DAMAGE 🔥";
    Icon = Skull;
    bgGradient = "from-[#FF3B5C] via-[#EC4899] to-[#11111F] border-rose-400 text-white shadow-rose-600/60";
  } else if (intensity >= 7) {
    title = "💀 HEAVY OOKU";
    badgeText = "DIRECT HIT 🔥";
    Icon = Skull;
    bgGradient = "from-[#FF3B5C]/90 via-[#19192B]/95 to-[#11111F]/95 border-rose-500/60 text-white shadow-rose-500/30";
  } else {
    title = "😏 LIGHT OOKU";
    badgeText = "SMALL DAMAGE";
    Icon = AlertTriangle;
    bgGradient = "from-[#8B5CF6]/90 via-[#19192B]/95 to-[#11111F]/95 border-purple-500/50 text-white shadow-purple-500/30";
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Background impact flash */}
      <div className="absolute inset-0 bg-rose-500/15 animate-impact-flash" />

      {/* Main Gaming Kill Notification Card */}
      <div className={`relative max-w-lg w-full p-6 sm:p-8 rounded-3xl border-2 shadow-2xl backdrop-blur-2xl text-center space-y-4 animate-kill-pop bg-gradient-to-b ${bgGradient}`}>
        {/* Animated Icon Badge */}
        <div className="inline-flex p-4 rounded-2xl bg-black/50 border border-white/20 shadow-2xl">
          <Icon className="w-12 h-12 animate-bounce text-amber-300" />
        </div>

        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs font-mono font-extrabold tracking-widest text-slate-300 uppercase block">
            💀 {title} 💀
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white drop-shadow-lg">
            {badgeText}
          </h2>
        </div>

        {/* Damage Box */}
        <div className="inline-block px-6 py-3 rounded-2xl bg-black/70 border border-white/20 text-center shadow-xl">
          <span className="text-xs font-mono text-slate-400 block font-semibold">DAMAGE DEALT</span>
          <span className="text-3xl sm:text-5xl font-extrabold font-mono text-[#FF3B5C] drop-shadow-md">
            +{damage}
          </span>
        </div>

        {/* Target & Speaker Bar */}
        <div className="pt-3 text-xs sm:text-sm font-mono text-slate-200 flex items-center justify-center gap-2 border-t border-white/15">
          <span className="text-cyan-300 font-extrabold">{event.speaker || event.sender_name}</span>
          <span className="text-rose-400 font-bold">💥 TARGETED</span>
          <span className="text-rose-300 font-extrabold">{event.target || event.target_name || "Friend"}</span>
        </div>
      </div>
    </div>
  );
}
