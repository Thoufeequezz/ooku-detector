import React, { useEffect, useRef, useState } from 'react';
import { Crown, Flame, Trophy, Sparkles, Zap, LogOut } from 'lucide-react';
import { calculatePlayerStats } from '../utils/scoreCalculator';

export function LiveScoreboard({ ookuEvents = [], members = [], messages = [] }) {
  const [takeoverNotice, setTakeoverNotice] = useState(null);
  const previousLeaderRef = useRef(null);

  // Compute standings using centralized calculator
  const { allPlayers, activePlayers, exitedPlayers } = calculatePlayerStats(messages, ookuEvents, members);

  const currentLeader = activePlayers[0] ? activePlayers[0].name : (allPlayers[0] ? allPlayers[0].name : null);
  const maxDamage = allPlayers[0] ? Math.max(allPlayers[0].damage, 1) : 1;

  // Detect Leaderboard Takeover
  useEffect(() => {
    if (
      currentLeader &&
      previousLeaderRef.current &&
      previousLeaderRef.current !== currentLeader &&
      allPlayers[0] && allPlayers[0].damage > 0
    ) {
      setTakeoverNotice({
        newLeader: currentLeader,
        oldLeader: previousLeaderRef.current
      });

      const timer = setTimeout(() => setTakeoverNotice(null), 3000);
      return () => clearTimeout(timer);
    }
    previousLeaderRef.current = currentLeader;
  }, [currentLeader, allPlayers]);

  const renderPlayerRow = (player) => {
    const isFirst = player.rank === 1 && player.damage > 0;
    const initial = player.name ? player.name.charAt(0).toUpperCase() : '?';
    const progressPercent = Math.min(Math.round((player.damage / maxDamage) * 100), 100);
    const isExited = !player.is_active;

    return (
      <div
        key={player.name}
        className={`p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
          isExited
            ? 'bg-[#11111F]/60 border-slate-800 text-slate-400 opacity-80'
            : isFirst
            ? 'bg-gradient-to-r from-[#19192B] via-[#11111F] to-[#19192B] border-amber-500/50 shadow-lg shadow-amber-500/10'
            : 'bg-[#11111F] border-purple-500/20 hover:border-purple-500/40'
        }`}
      >
        {/* Progress bar background indicator */}
        <div
          className={`absolute left-0 bottom-0 top-0 transition-all duration-500 pointer-events-none ${
            isExited ? 'bg-slate-800/30' : 'bg-purple-500/10'
          }`}
          style={{ width: `${progressPercent}%` }}
        />

        <div className="relative z-10 flex items-center justify-between">
          {/* Left Rank & Avatar */}
          <div className="flex items-center gap-2.5">
            {/* Rank Badge / Crown */}
            <div className="w-5 text-center font-mono text-xs font-extrabold text-slate-400 shrink-0">
              {isFirst && !isExited ? (
                <Crown className="w-4 h-4 text-amber-400 animate-bounce mx-auto" />
              ) : (
                `#${player.rank}`
              )}
            </div>

            {/* Initial Avatar */}
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center font-mono font-extrabold text-sm text-white shrink-0 shadow-md ${
                isExited
                  ? 'bg-slate-900 border border-slate-700 text-slate-400'
                  : isFirst
                  ? 'gradient-purple-pink border border-amber-400/40 shadow-amber-500/20'
                  : 'bg-[#19192B] border border-purple-500/30'
              }`}
            >
              {initial}
            </div>

            {/* Player Name */}
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs sm:text-sm font-bold tracking-wide ${isExited ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {player.name}
                </span>
                {isFirst && !isExited && (
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    👑 KING
                  </span>
                )}
                {isExited && (
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30 flex items-center gap-0.5">
                    <LogOut className="w-2.5 h-2.5" /> EXITED
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 block">
                {player.ookuCount} {player.ookuCount === 1 ? 'roast' : 'roasts'}
              </span>
            </div>
          </div>

          {/* Right Score & Combo */}
          <div className="text-right shrink-0">
            <div className={`text-xs sm:text-sm font-mono font-extrabold flex items-center justify-end gap-1 ${isExited ? 'text-slate-400' : 'text-rose-400'}`}>
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>{player.damage}</span>
            </div>

            {player.bestCombo >= 2 && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-mono font-bold text-cyan-300 px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 mt-0.5">
                <Zap className="w-2.5 h-2.5 text-cyan-400" />
                <span>x{player.bestCombo} COMBO</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

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
          {activePlayers.length} ONLINE • {exitedPlayers.length} EXITED
        </span>
      </div>

      {/* Leaderboard Cards Container */}
      <div className="space-y-2">
        {allPlayers.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-slate-500 bg-[#11111F] rounded-2xl border border-purple-500/10">
            No roasts recorded yet. Waiting for chaos... 👀
          </div>
        ) : (
          <>
            {/* Active Players */}
            {activePlayers.map(renderPlayerRow)}

            {/* Exited Players Divider */}
            {exitedPlayers.length > 0 && (
              <div className="pt-3">
                <div className="flex items-center gap-2 mb-2 px-1 text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>🚪 EXITED PLAYERS</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
                <div className="space-y-2">
                  {exitedPlayers.map(renderPlayerRow)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
