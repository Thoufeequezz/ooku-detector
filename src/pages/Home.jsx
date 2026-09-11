import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, PlusCircle, LogIn, Sparkles, Play } from 'lucide-react';
import { BackgroundFloatingEmojis } from '../components/BackgroundFloatingEmojis';

const ROTATING_LINES = [
  "No login. No profile. Just bad decisions.",
  "Your friends are about to regret this.",
  "AI is watching. 👀",
  "This chat has no HR department.",
  "Friendship may not survive.",
  "Please think before you type. Actually, don't."
];

export function Home() {
  const navigate = useNavigate();
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLineIndex((prev) => (prev + 1) % ROTATING_LINES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex flex-col justify-between items-center p-6 relative overflow-hidden bg-grid-cyber selection:bg-[#EC4899] selection:text-white">
      {/* Background Glow & Ambient Floaters */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-radial-glow pointer-events-none z-0" />
      <BackgroundFloatingEmojis />

      {/* Top Banner Tagline */}
      <div className="pt-6 sm:pt-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#11111F] border border-purple-500/30 text-xs sm:text-sm font-mono text-purple-300 shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Most Useless Project Competition 2026</span>
        </div>
      </div>

      {/* Main Hero Content */}
      <main className="max-w-3xl w-full mx-auto text-center space-y-8 relative z-10 py-10">
        {/* Animated Main Icon */}
        <div className="inline-flex items-center justify-center p-5 sm:p-6 rounded-3xl bg-[#11111F] border-2 border-purple-500/40 text-white shadow-2xl shadow-purple-500/20 mb-2">
          <Flame className="w-16 h-16 sm:w-20 sm:h-20 animate-pulse text-[#FF3B5C]" />
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight font-mono text-white drop-shadow-md">
            OOKU DETECTION
          </h1>

          <h3 className="text-xl sm:text-3xl font-extrabold text-[#EC4899] font-mono tracking-tight">
            “Chat normally. AI will judge you. 💀”
          </h3>
        </div>

        {/* HUGE Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-lg mx-auto">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-1/2 h-[64px] rounded-2xl gradient-purple-pink hover:opacity-95 text-white font-mono font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer border border-white/20"
          >
            <PlusCircle className="w-6 h-6" />
            <span>🔥 CREATE ROOM</span>
          </button>

          <button
            onClick={() => navigate('/join')}
            className="w-full sm:w-1/2 h-[64px] rounded-2xl bg-[#11111F] hover:bg-[#19192B] text-cyan-300 font-mono font-extrabold text-lg sm:text-xl flex items-center justify-center gap-3 border-2 border-cyan-500/40 hover:border-cyan-400 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
          >
            <LogIn className="w-6 h-6" />
            <span>👀 JOIN ROOM</span>
          </button>
        </div>

        {/* Rotating Comedy Line */}
        <div className="space-y-3 pt-2">
          <div className="h-9 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-mono text-cyan-300 bg-[#11111F] px-4 py-1.5 rounded-full border border-purple-500/30 transition-all duration-300 animate-fadeIn shadow-lg">
              ✨ "{ROTATING_LINES[lineIndex]}"
            </span>
          </div>
        </div>

        {/* Preloaded Demo Room Launcher */}
        <div className="pt-6 border-t border-purple-500/20 max-w-sm mx-auto">
          <button
            onClick={() => navigate('/chat/KMEA482?demo=true')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition-colors p-2"
          >
            <Play className="w-4 h-4 fill-cyan-400" />
            <span>Launch Preloaded Demo Room 🎭</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-slate-500 relative z-10">
        OOKU DETECTION • "Chat normally. AI will judge you. 💀"
      </footer>
    </div>
  );
}
