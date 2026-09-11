import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoomCode } from '../components/RoomCode';
import { createRoom } from '../services/supabase';
import { saveParticipantSession } from '../utils/roomStorage';
import { ArrowLeft, User, Sparkles, LogIn, AlertCircle } from 'lucide-react';
import { BackgroundFloatingEmojis } from '../components/BackgroundFloatingEmojis';

export function CreateRoom() {
  const navigate = useNavigate();
  const [creatorName, setCreatorName] = useState('');
  const [createdRoomCode, setCreatedRoomCode] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const name = creatorName.trim();
    if (!name) {
      setErrorMsg('Please enter your name 👀');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const result = await createRoom(name);
      setCreatedRoomCode(result.roomCode);
      saveParticipantSession(result.roomCode, name, true);
    } catch (err) {
      setErrorMsg('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterChat = () => {
    if (createdRoomCode) {
      navigate(`/chat/${createdRoomCode}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#080812] text-[#F8FAFC] flex flex-col justify-center items-center p-6 relative overflow-hidden bg-grid-cyber selection:bg-[#EC4899]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-radial-glow pointer-events-none z-0" />
      <BackgroundFloatingEmojis />

      <div className="max-w-lg w-full mx-auto space-y-6 relative z-10">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-mono text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="cyber-glass rounded-3xl p-6 sm:p-10 border border-purple-500/30 space-y-6 shadow-2xl">
          {!createdRoomCode ? (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  Start the chaos. 🔥
                </h2>
                <p className="text-sm font-mono text-purple-300">
                  Give yourself a name. Your future Ooku statistics depend on it.
                </p>
              </div>

              <form onSubmit={handleCreate} className="space-y-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-mono font-bold text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>What should your friends call you?</span>
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => {
                      setCreatorName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="Enter your name 👀"
                    className="w-full h-[58px] px-5 rounded-2xl bg-[#11111F] border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none text-lg text-white placeholder-slate-500 font-sans shadow-inner transition-all"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs sm:text-sm font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[64px] rounded-2xl gradient-purple-pink hover:opacity-95 text-white font-mono font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl shadow-purple-600/30 active:scale-95 transition-all cursor-pointer border border-white/20"
                >
                  <Sparkles className="w-6 h-6" />
                  <span>{isLoading ? "CREATING..." : "CREATE ROOM 🔥"}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="space-y-6 animate-fadeIn text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-extrabold font-mono text-white tracking-tight">
                  ROOM CREATED 🎉
                </h2>
                <p className="text-sm font-mono text-purple-300">
                  Share this code with your victims.
                </p>
              </div>

              <RoomCode code={createdRoomCode} />

              <button
                onClick={handleEnterChat}
                className="w-full h-[64px] rounded-2xl gradient-cyan-purple hover:opacity-95 text-white font-mono font-extrabold text-xl flex items-center justify-center gap-3 shadow-xl shadow-cyan-600/30 active:scale-95 transition-all cursor-pointer border border-white/20"
              >
                <LogIn className="w-6 h-6" />
                <span>ENTER CHAT →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
