import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { fetchRoomDetails } from '../services/supabase';
import { calculatePlayerStats, calculateAwards, generateFriendshipDiagnosis } from '../utils/scoreCalculator';
import { MedicalScanner } from '../components/MedicalScanner';
import { Flame, Skull, Crown, Zap, RefreshCw, Share2, Check, AlertTriangle, Sparkles, Trophy, LogOut, MessageSquare } from 'lucide-react';
import { BackgroundFloatingEmojis } from '../components/BackgroundFloatingEmojis';

export function Report() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [playerData, setPlayerData] = useState(null);
  const [awards, setAwards] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const details = await fetchRoomDetails(roomCode);
        const calc = calculatePlayerStats(details.messages, details.ookuEvents, details.members);
        const calcAwards = calculateAwards(calc.allPlayers, details.ookuEvents);
        const calcDiag = generateFriendshipDiagnosis(calc.totalMessages, calc.totalOokuCount, calc.totalDamage);

        setPlayerData(calc);
        setAwards(calcAwards);
        setDiagnosis(calcDiag);
      } catch (err) {
        console.warn("Failed to load room report stats:", err);
        const fallback = calculatePlayerStats([], [], [{ name: "Adil" }, { name: "Thoufeek" }]);
        setPlayerData(fallback);
        setAwards(calculateAwards(fallback.allPlayers, []));
        setDiagnosis(generateFriendshipDiagnosis(0, 0, 0));
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [roomCode]);

  const handleShareReport = () => {
    if (!playerData) return;
    const ookuKing = playerData.allPlayers[0] ? playerData.allPlayers[0].name : 'None';
    const shareText = `OOKU DETECTION SCOREBOARD 💀\nRoom: ${roomCode}\nTotal Damage: ${playerData.totalDamage} DMG\n🥇 #1 Winner: ${ookuKing}\nDiagnosis: ${diagnosis?.status || 'SEVERE OOKU SYNDROME'}\nTested on Friendship OS!`;

    if (navigator.share) {
      navigator.share({ title: 'Ooku Detection Scoreboard', text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (loading || !playerData) {
    return (
      <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex items-center justify-center font-mono p-6">
        <div className="flex items-center gap-3 text-lg text-purple-300">
          <Flame className="w-8 h-8 text-[#FF3B5C] animate-spin" />
          <span>Calculating Final Ooku Scoreboard... 💀</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex flex-col justify-between items-center p-4 sm:p-6 relative overflow-hidden bg-grid-cyber selection:bg-[#EC4899]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-glow pointer-events-none z-0" />
      <BackgroundFloatingEmojis />

      <main className="max-w-4xl w-full mx-auto space-y-8 relative z-10 py-6 sm:py-8 animate-fadeIn">
        {/* Intro Transition Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11111F] border border-rose-500/40 text-xs font-mono text-rose-300 font-extrabold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>SESSION COMPLETE 💀</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight font-mono text-white drop-shadow-md">
            💀 THE CHAOS IS OVER
          </h1>

          <h3 className="text-xl sm:text-3xl font-black font-mono text-[#EC4899]">
            FINAL OOKU SCOREBOARD
          </h3>

          <p className="text-xs sm:text-sm font-mono text-purple-300">
            Room Code: <span className="text-cyan-300 font-bold">{roomCode}</span> • Total Damage: <span className="text-rose-400 font-bold">🔥 {playerData.totalDamage} DMG</span>
          </p>
        </div>

        {/* DRAMATIC ANIMATED RANKINGS REVEAL */}
        <div className="cyber-glass rounded-3xl p-5 sm:p-8 border-2 border-purple-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center gap-2 font-mono text-sm sm:text-base font-black text-amber-300">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>FINAL RANKINGS & STANDINGS</span>
            </div>
            <span className="text-xs font-mono text-slate-400 bg-[#19192B] px-3 py-1 rounded-full border border-purple-500/20">
              {playerData.allPlayers.length} PARTICIPANTS
            </span>
          </div>

          <div className="space-y-3">
            {playerData.allPlayers.map((player, index) => {
              const isFirst = player.rank === 1 && player.damage > 0;
              const isSecond = player.rank === 2;
              const isThird = player.rank === 3;

              const rankBadge = isFirst ? '🥇 #1' : isSecond ? '🥈 #2' : isThird ? '🥉 #3' : `${player.rank}️⃣ #${player.rank}`;

              return (
                <div
                  key={player.name}
                  className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-scale-up ${
                    isFirst
                      ? 'bg-gradient-to-r from-[#19192B] via-[#11111F] to-[#19192B] border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'bg-[#11111F] border-purple-500/20'
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="text-xl sm:text-2xl font-mono font-black shrink-0">
                      {rankBadge}
                    </div>

                    {/* Avatar & Name */}
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] border border-white/20 flex items-center justify-center font-mono font-black text-lg text-white shadow-md shrink-0">
                      {player.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-black font-mono text-white">
                          {player.name}
                        </span>
                        {isFirst && (
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                            👑 OOKU KING
                          </span>
                        )}
                        {!player.is_active && (
                          <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                            🚪 EXITED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mt-0.5">
                        <span>💀 {player.ookuCount} roasts</span>
                        {player.bestCombo >= 2 && (
                          <span className="text-cyan-300 font-bold">🔥 x{player.bestCombo} Combo</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Damage Score */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-purple-500/10">
                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block">Total Damage</span>
                      <span className="text-xl sm:text-2xl font-black font-mono text-rose-400 flex items-center gap-1 justify-end">
                        <Flame className="w-5 h-5 text-rose-500" /> {player.damage}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FINAL AWARDS SECTION */}
        {awards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl sm:text-2xl font-black font-mono text-center text-amber-300 tracking-tight flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>SPECIAL SESSION AWARDS</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((award) => (
                <div
                  key={award.title}
                  className="cyber-glass rounded-3xl p-5 border border-purple-500/30 space-y-2 hover:border-purple-500/60 transition-all shadow-xl"
                >
                  <span className="text-xs font-mono font-black text-amber-300 block uppercase">
                    {award.title}
                  </span>
                  <div className="text-xl font-black font-mono text-white">
                    {award.winner}
                  </div>
                  <div className="text-xs font-mono text-slate-400">
                    {award.subtitle}
                  </div>
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs font-mono font-bold text-cyan-300">
                      {award.stat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Animated Medical Scanner / Friendship Diagnosis Section */}
        {!scanFinished ? (
          <MedicalScanner onComplete={() => setScanFinished(true)} />
        ) : (
          /* Dynamic Friendship Diagnosis Card */
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border-2 border-rose-500/50 text-center space-y-4 shadow-2xl relative overflow-hidden animate-popup-pop">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF3B5C]" />

            <span className="text-xs font-mono font-extrabold text-purple-300 uppercase tracking-widest block">
              🩺 YOUR FRIENDSHIP DIAGNOSIS
            </span>

            <h2 className="text-3xl sm:text-5xl font-black font-mono text-[#FF3B5C]">
              {diagnosis?.status || '💀 SEVERE OOKU SYNDROME'}
            </h2>

            <p className="text-base sm:text-xl italic font-medium text-slate-200 max-w-2xl mx-auto font-sans leading-relaxed">
              "{diagnosis?.quote}"
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2 text-center">
              <div className="p-3 rounded-2xl bg-[#19192B] border border-purple-500/20">
                <span className="block text-xs font-mono text-slate-400">Messages</span>
                <span className="text-lg font-black font-mono text-cyan-300">{diagnosis?.totalMessages || 0}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#19192B] border border-rose-500/20">
                <span className="block text-xs font-mono text-slate-400">Ooku Attacks</span>
                <span className="text-lg font-black font-mono text-rose-400">{diagnosis?.totalOoku || 0}</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#19192B] border border-amber-500/20">
                <span className="block text-xs font-mono text-slate-400">Total Damage</span>
                <span className="text-lg font-black font-mono text-amber-300">{diagnosis?.totalDamage || 0}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-500/20 text-xs sm:text-sm font-mono text-purple-300 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{diagnosis?.disclaimer}</span>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-4 text-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <button
              onClick={() => navigate('/')}
              className="w-full sm:w-2/3 h-[60px] rounded-2xl gradient-purple-pink hover:opacity-95 text-white font-mono font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer border border-white/20"
            >
              <RefreshCw className="w-5 h-5" />
              <span>START ANOTHER CHAT</span>
            </button>

            <button
              onClick={handleShareReport}
              className="w-full sm:w-1/3 h-[60px] rounded-2xl bg-[#11111F] hover:bg-[#19192B] text-cyan-300 border-2 border-cyan-500/40 font-mono font-extrabold text-base flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              {copiedShare ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-5 h-5 text-cyan-400" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="py-4 text-center text-xs font-mono text-slate-500 relative z-10">
        OOKU DETECTION • Most Useless Project Competition 2026
      </footer>
    </div>
  );
}
