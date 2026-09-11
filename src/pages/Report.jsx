import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';
import { fetchRoomDetails } from '../services/supabase';
import { calculateOokuReport } from '../utils/scoring';
import { MedicalScanner } from '../components/MedicalScanner';
import { Flame, Skull, Crown, Zap, RefreshCw, Share2, Check, AlertTriangle, Sparkles } from 'lucide-react';
import { BackgroundFloatingEmojis } from '../components/BackgroundFloatingEmojis';

export function Report() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedShare, setCopiedShare] = useState(false);
  const [scanFinished, setScanFinished] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const details = await fetchRoomDetails(roomCode);
        const calculated = calculateOokuReport(details.ookuEvents, details.members);
        setStats(calculated);
      } catch (err) {
        console.warn("Failed to load room report stats:", err);
        setStats(calculateOokuReport([], ["Adil", "Thoufeek"]));
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [roomCode]);

  const handleShareReport = () => {
    if (!stats) return;
    const shareText = `FRIENDSHIP REPORT 💀\nTotal Ooku Damage: ${stats.totalDamage || stats.totalOoku * 50}\nOoku King: ${stats.ookuKing}\nMost Roasted: ${stats.mostRoasted}\nDiagnosis: SEVERE MUTUAL OOKU SYNDROME\nTested on Friendship OS!`;

    if (navigator.share) {
      navigator.share({ title: 'Friendship OS Report', text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex items-center justify-center font-mono p-6">
        <div className="flex items-center gap-3 text-lg text-purple-300">
          <Flame className="w-8 h-8 text-[#FF3B5C] animate-spin" />
          <span>Calculating Friendship Telemetry... 💀</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex flex-col justify-between items-center p-6 relative overflow-hidden bg-grid-cyber selection:bg-[#EC4899]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-glow pointer-events-none z-0" />
      <BackgroundFloatingEmojis />

      <main className="max-w-3xl w-full mx-auto space-y-8 relative z-10 py-8 animate-fadeIn">
        {/* Intro Transition Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11111F] border border-purple-500/30 text-xs font-mono text-amber-300 font-extrabold shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>THE CHAOS IS OVER 💀</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-mono text-white drop-shadow-md">
            WELL...
          </h1>

          <h3 className="text-2xl sm:text-4xl font-extrabold font-mono text-[#EC4899]">
            THAT ESCALATED QUICKLY. 💀
          </h3>

          <p className="text-sm font-mono text-purple-300">
            Friendship investigation complete for Room <span className="text-cyan-300 font-bold">{roomCode}</span>.
          </p>
        </div>

        {/* Staggered Animated Award Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="👑 OOKU KING"
            value={stats.ookuKing}
            subtext="“Congratulations. Nobody asked for this achievement.”"
            icon={Crown}
            color="amber"
          />

          <StatCard
            title="💀 MOST ROASTED"
            value={stats.mostRoasted}
            subtext="“Thoughts and prayers.”"
            icon={Skull}
            color="rose"
          />

          <StatCard
            title="🔥 BIGGEST HIT"
            value={`${stats.biggestHit} DAMAGE`}
            subtext="“Yeah... we're not discussing that.”"
            icon={Flame}
            color="rose"
          />

          <StatCard
            title="⚡ COMBO MASTER"
            value={`×${stats.longestCombo}`}
            subtext="“At this point, just fight.”"
            icon={Zap}
            color="cyan"
          />

          <StatCard
            title="💀 TOTAL DAMAGE"
            value={(stats.totalOoku * 50).toLocaleString()}
            subtext="Total roasts detected by AI referee"
            icon={Flame}
            color="purple"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        {/* Animated Medical Scanner Section */}
        {!scanFinished ? (
          <MedicalScanner onComplete={() => setScanFinished(true)} />
        ) : (
          /* Official Comedic Diagnosis Card */
          <div className="cyber-glass rounded-3xl p-6 sm:p-10 border-2 border-rose-500/50 text-center space-y-4 shadow-2xl relative overflow-hidden animate-popup-pop">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#FF3B5C]" />

            <span className="text-xs font-mono font-extrabold text-purple-300 uppercase tracking-widest block">
              🩺 OFFICIAL DIAGNOSIS
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-mono text-[#FF3B5C]">
              💀 SEVERE MUTUAL OOKU SYNDROME
            </h2>

            <p className="text-lg sm:text-xl italic font-medium text-slate-200 max-w-2xl mx-auto font-sans leading-relaxed">
              "You insult each other constantly, counter-attack immediately, and somehow still call each other friends."
            </p>

            <div className="pt-4 border-t border-purple-500/20 text-xs sm:text-sm font-mono text-purple-300 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>100% fictional diagnosis. We are not doctors. 😂</span>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="pt-4 text-center space-y-4">
          <span className="block text-xs font-mono font-bold text-[#EC4899] uppercase tracking-widest">
            🔥 DO IT AGAIN
          </span>

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
