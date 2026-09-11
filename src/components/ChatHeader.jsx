import React, { useState } from 'react';
import { Flame, MoreVertical, LogOut, ShieldAlert, Copy, Check, Skull } from 'lucide-react';
import { RoomMembers } from './RoomMembers';
import { RoomAudioControl } from './RoomAudioControl';

export function ChatHeader({
  roomCode,
  members = [],
  ookuCount = 0,
  totalDamage = 0,
  isCreator = false,
  onOpenEndModal
}) {
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <header className="cyber-glass border-b border-purple-500/20 px-4 sm:px-6 py-3 sticky top-0 z-40 backdrop-blur-2xl flex items-center justify-between shadow-2xl">
      {/* Brand & Room Code */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] border border-white/20 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 shrink-0">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-extrabold font-mono tracking-tight text-white flex items-center gap-1.5">
              <span>🔥 OOKU DETECTION</span>
            </h1>

            {/* Room Code Quick Copy Badge */}
            <button
              onClick={handleCopyCode}
              className="text-xs sm:text-sm font-mono font-bold text-cyan-300 px-2.5 py-0.5 rounded-lg bg-[#19192B] border border-cyan-500/40 hover:bg-cyan-950/60 transition-all flex items-center gap-1 cursor-pointer"
              title="Click to copy room code"
            >
              <span>{roomCode}</span>
              {copiedCode ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-cyan-400 opacity-70" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-slate-400 mt-0.5">
            {/* Clickable Online Badge with Green Pulse */}
            <button
              onClick={() => setIsMembersOpen(!isMembersOpen)}
              className="flex items-center gap-1.5 text-emerald-400 hover:underline cursor-pointer font-semibold"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>🟢 {members.length} {members.length === 1 ? 'friend' : 'friends'} online</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side controls: Live Damage, Voice Control + Three Dots Menu */}
      <div className="flex items-center gap-2">
        {/* Compact Damage Counter for Mobile / Header */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#19192B] border border-rose-500/30 text-xs font-mono text-rose-300 font-bold">
          <Skull className="w-3.5 h-3.5 text-rose-400" />
          <span>💀 {totalDamage.toLocaleString()} DAMAGE</span>
        </div>

        <RoomAudioControl />

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-[#19192B] text-slate-200 hover:text-white border border-purple-500/30 flex items-center justify-center transition-colors cursor-pointer"
            title="Room Menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 cyber-glass rounded-2xl border border-purple-500/30 shadow-2xl p-2 z-50 animate-fadeIn">
              {isCreator ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenEndModal();
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 text-xs sm:text-sm font-mono font-bold flex items-center gap-2 border border-rose-500/40 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>End Chat 💀</span>
                </button>
              ) : (
                <div className="px-3 py-2 text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Only host can end session</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Online Members Dropdown Popup */}
      {isMembersOpen && (
        <RoomMembers
          members={members}
          onClose={() => setIsMembersOpen(false)}
        />
      )}
    </header>
  );
}
