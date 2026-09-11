import React from 'react';
import { Flame, Skull, Zap, AlertTriangle } from 'lucide-react';

export function OokuReaction({ event, comboText }) {
  if (!event || !event.isOoku) return null;

  const intensity = Number(event.intensity) || 7;
  const damage = Number(event.damage) || (intensity * 10);
  const isCounter = event.type === 'COUNTER_OOKU';

  // Determine Reaction Theme & Microcopy
  let title = "😂 DIRECT HIT";
  let subtitle = "That one landed.";
  let Icon = AlertTriangle;
  let themeStyles = "bg-[#11111F] border-[#FF3B5C]/50 text-rose-200 shadow-rose-500/20";
  let isShake = false;

  if (isCounter) {
    title = "🔥 COUNTER ATTACK";
    subtitle = "“Oh, we're doing this now?”";
    Icon = Zap;
    themeStyles = "bg-[#11111F] border-amber-500/50 text-amber-200 shadow-amber-500/20";
  } else if (intensity >= 9) {
    title = "☠️ CRITICAL OOKU";
    subtitle = "“Someone check on him.” 💀";
    Icon = Skull;
    themeStyles = "bg-gradient-to-r from-[#FF3B5C]/20 via-[#11111F] to-[#8B5CF6]/20 border-[#FF3B5C]/80 text-rose-100 shadow-rose-600/40";
    isShake = true;
  } else if (intensity >= 7) {
    title = "💀 HEAVY OOKU";
    subtitle = "“Friendship is in danger.”";
    Icon = Skull;
    themeStyles = "bg-[#11111F] border-purple-500/50 text-purple-200 shadow-purple-500/20";
  } else if (intensity >= 5) {
    title = "😂 DIRECT HIT";
    subtitle = "“That one landed.”";
    Icon = Flame;
    themeStyles = "bg-[#11111F] border-amber-500/50 text-amber-200 shadow-amber-500/20";
  } else {
    title = "😏 LIGHT OOKU";
    subtitle = "“Small damage.”";
    Icon = Flame;
    themeStyles = "bg-[#11111F] border-purple-500/30 text-purple-200 shadow-purple-500/10";
  }

  return (
    <div className={`my-3.5 flex justify-center animate-message-pop ${isShake ? 'animate-ooku-screen-shake' : ''}`}>
      <div className={`max-w-md w-full p-4 rounded-2xl border-2 shadow-xl backdrop-blur-md text-center transition-all ${themeStyles}`}>
        {/* Reaction Header Title & Combo Badge */}
        <div className="flex items-center justify-center gap-2 font-mono text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-1.5">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 animate-pulse text-[#FF3B5C]" />
          <span>{title}</span>

          {comboText && (
            <span className="ml-1.5 px-2.5 py-0.5 rounded-full bg-[#FF3B5C]/30 border border-[#FF3B5C]/60 text-white text-xs font-mono font-extrabold animate-combo-bounce shadow-md">
              {comboText}
            </span>
          )}
        </div>

        {/* Target & Speaker */}
        <div className="text-xs sm:text-sm font-semibold">
          <span className="text-cyan-300 font-bold">{event.speaker || event.sender_name}</span>
          <span className="text-slate-400 mx-2">→</span>
          <span className="text-rose-300 font-bold">{event.target || event.target_name || "Friend"}</span>
        </div>

        {/* Subtitle & Damage */}
        <div className="mt-1.5 text-xs font-mono text-slate-300 flex items-center justify-center gap-2">
          <span className="italic font-sans text-slate-200">{subtitle}</span>
          <span>•</span>
          <span className="text-[#FF3B5C] font-extrabold">DAMAGE: {damage}</span>
        </div>
      </div>
    </div>
  );
}
