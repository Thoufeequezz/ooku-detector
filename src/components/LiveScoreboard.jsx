import React, { useEffect, useRef, useState } from 'react';
import { Crown, Flame, Trophy, Sparkles, Zap } from 'lucide-react';

export function LiveScoreboard({ ookuEvents = [], members = [] }) {
  const [takeoverNotice, setTakeoverNotice] = useState(null);
  const previousLeaderRef = useRef(null);

  // Compute standings dynamically
  const scoresMap = {};
  
  // Initialize all members
  members.forEach((m) => {
    const name = typeof m === 'string' ? m : m.name;
    if (name) {
      scoresMap[name] = { name, damage: 0, roasts: 0, combo: 0 };
    }
  });

  // Calculate scores & combos from events
  ookuEvents.forEach((e) => {
    if (!e || !e.isOoku) return;
    const speaker = e.speaker || e.sender_name || 'Anonymous';
    if (!scoresMap[speaker]) {
      scoresMap[speaker] = { name: speaker, damage: 0, roasts: 0, combo: 0 };
    }

    const eventDamage = Number(e.damage) || (Number(e.intensity) || 7) * 10;
    scoresMap[speaker].damage += eventDamage;
    scoresMap[speaker].roasts += 1;
  });

  const sortedLeaderboard = Object.values(scoresMap).sort((a, b) => b.damage - a.damage);
  const currentLeader = sortedLeaderboard[0] ? sortedLeaderboard[0].name : null;
  const maxDamage = sortedLeaderboard[0] ? Math.max(sortedLeaderboard[0].damage, 1) : 1;

  // Detect Leaderboard Takeover
  useEffect(() => {
    if (
      currentLeader &&
      previousLeaderRef.current &&
      previousLeaderRef.current !== currentLeader &&
      sortedLeaderboard[0].damage > 0
    ) {
      setTakeoverNotice({
        newLeader: currentLeader,
        oldLeader: previousLeaderRef.current
      });

      const timer = setTimeout(() => setTakeoverNotice(null), 3000);
      return () => clearTimeout(timer);
    }
    previousLeaderRef.current = currentLeader;
  }, [currentLeader, sortedLeaderboard]);

  return (
    <div className="relative space-y-3">
      {/* Animated Leaderboard Takeover Banner */}
      {takeoverNotice && (
        <div className="absolute -top-12 left-0 right-0 z-30 flex justify-center animate-takeover-banner pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF3B5C] via-[#8B5CF6] to-[#EC4899] text-white font-mono font-extrabold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-white/30">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>LEADERBOARD TAKEOVER! 🔥 {takeoverNotice.newLeader} passed {takeoverNotice.oldLeader}!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 font-mono text-xs font-extrabold tracking-wider text-purple-300 uppercase">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>LIVE OOKU LEADERBOARD</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-[#19192B] px-2 py-0.5 rounded-full border border-purple-500/20">
          {sortedLeaderboard.length} PLAYERS
        </span>
      </div>

      {/* Leaderboard Cards Container */}
      <div className="space-y-2">
        {sortedLeaderboard.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-slate-500 bg-[#11111F] rounded-2xl border border-purple-500/10">
            No roasts recorded yet. Waiting for chaos... 👀
          </div>
        ) : (
          sortedLeaderboard.map((player, index) => {
            const isFirst = index === 0 && player.damage > 0;
            const initial = player.name ? player.name.charAt(0).toUpperCase() : '?';
            const progressPercent = Math.min(Math.round((player.damage / maxDamage) * 100), 100);

            return (
              <div
                key={player.name}
                className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                  isFirst
                    ? 'bg-gradient-to-r from-[#19192B] via-[#11111F] to-[#19192B] border-amber-500/50 shadow-lg shadow-amber-500/10'
                    : 'bg-[#11111F] border-purple-500/20 hover:border-purple-500/40'
                }`}
              >
                {/* Progress bar background indicator */}
                <div
                  className="absolute left-0 bottom-0 top-0 bg-purple-500/10 transition-all duration-500 pointer-events-none"
                  style={{ width: `${progressPercent}%` }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  {/* Left Rank & Avatar */}
                  <div className="flex items-center gap-2.5">
                    {/* Rank Badge / Crown */}
                    <div className="w-5 text-center font-mono text-xs font-extrabold text-slate-400 shrink-0">
                      {isFirst ? (
                        <Crown className="w-4 h-4 text-amber-400 animate-bounce mx-auto" />
                      ) : (
                        `#${index + 1}`
                      )}
                    </div>

                    {/* Initial Avatar */}
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm text-white shrink-0 shadow-md ${
                        isFirst
                          ? 'gradient-purple-pink border border-amber-400/40 shadow-amber-500/20'
                          : 'bg-[#19192B] border border-purple-500/30'
                      }`}
                    >
                      {initial}
                    </div>

                    {/* Player Name */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
                          {player.name}
                        </span>
                        {isFirst && (
                          <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                            👑 KING
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {player.roasts} {player.roasts === 1 ? 'roast' : 'roasts'}
                      </span>
                    </div>
                  </div>

                  {/* Right Score & Combo */}
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-mono font-extrabold text-rose-400 flex items-center justify-end gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>{player.damage}</span>
                    </div>

                    {player.roasts >= 3 && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 mt-0.5">
                        <Zap className="w-2.5 h-2.5 text-cyan-400" />
                        <span>x{player.roasts} COMBO</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
