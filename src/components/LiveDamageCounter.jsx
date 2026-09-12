import React, { useEffect, useRef, useState } from 'react';
import { Flame, Skull, Zap } from 'lucide-react';

export function LiveDamageCounter({ totalDamage = 0 }) {
  const [isJumping, setIsJumping] = useState(false);
  const [floatingDamage, setFloatingDamage] = useState(null);
  const prevDamageRef = useRef(totalDamage);

  useEffect(() => {
    if (totalDamage > prevDamageRef.current) {
      const diff = totalDamage - prevDamageRef.current;
      setIsJumping(true);

      // Trigger floating damage badge
      setFloatingDamage({ id: Date.now(), diff });

      const timer = setTimeout(() => setIsJumping(false), 450);
      const floatTimer = setTimeout(() => setFloatingDamage(null), 1800);

      return () => {
        clearTimeout(timer);
        clearTimeout(floatTimer);
      };
    }
    prevDamageRef.current = totalDamage;
  }, [totalDamage]);

  return (
    <div className="relative cyber-glass rounded-3xl p-5 border border-rose-500/30 text-center space-y-2 shadow-2xl overflow-hidden">
      {/* Ambient Red Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-extrabold tracking-widest text-slate-400 uppercase">
        <Flame className="w-4 h-4 text-rose-400" />
        <span>TOTAL POINTS</span>
      </div>

      {/* Main Big Counter Display */}
      <div className="relative inline-block my-1">
        <span
          className={`block text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight transition-all duration-300 ${
            isJumping ? 'animate-damage-jump text-rose-400' : ''
          }`}
        >
          {totalDamage.toLocaleString()}
        </span>

        {/* Floating +50 POINTS Badge */}
        {floatingDamage && (
          <div className="absolute -top-7 right-0 left-0 flex justify-center pointer-events-none animate-float-up">
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF3B5C] text-white font-mono font-extrabold text-xs shadow-lg shadow-rose-500/40 border border-white/20 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-300" />
              <span>+{floatingDamage.diff} POINTS</span>
            </span>
          </div>
        )}
      </div>

      <div className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1">
        <Flame className="w-3.5 h-3.5 text-rose-500" />
        <span>Accumulated Ooku roasts in this session</span>
      </div>
    </div>
  );
}
