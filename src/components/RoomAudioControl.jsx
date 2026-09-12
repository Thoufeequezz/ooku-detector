import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioQueue } from '../services/audioQueue';

export function RoomAudioControl() {
  const [state, setState] = useState(() => audioQueue.getState());

  useEffect(() => {
    const unsubscribe = audioQueue.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!state.isEnabled) {
    return (
      <button
        onClick={() => audioQueue.enableAudio()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold transition-all shadow-md active:scale-95 cursor-pointer"
        title="Enable voice"
      >
        <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
        <span>🔊 Voice ON</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => audioQueue.toggleMute()}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all cursor-pointer ${
        state.isMuted
          ? 'bg-slate-900 border-slate-700 text-slate-400'
          : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300 shadow-md'
      }`}
      title={state.isMuted ? 'Voice OFF' : 'Voice ON'}
    >
      {state.isMuted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400" />
          <span>🔇 Voice OFF</span>
        </>
      ) : (
        <>
          <Volume2 className={`w-3.5 h-3.5 text-emerald-400 ${state.isPlaying ? 'animate-bounce' : ''}`} />
          <span>🔊 Voice ON</span>
        </>
      )}
    </button>
  );
}
