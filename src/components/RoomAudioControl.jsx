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

  // Before user interaction: prompt user to enable room audio
  if (!state.isEnabled) {
    return (
      <button
        onClick={() => audioQueue.enableAudio()}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/30 to-rose-600/30 hover:from-cyan-500/40 hover:to-rose-500/40 border border-cyan-400/40 text-cyan-200 hover:text-white text-xs font-mono font-bold tracking-wide transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95 cursor-pointer animate-pulse"
        title="Click to enable Gemini room audio"
      >
        <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
        <span>🔊 Enable Room Audio</span>
      </button>
    );
  }

  // Active state: Room Voice ON or Room Voice OFF toggle
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => audioQueue.toggleMute()}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium transition-all cursor-pointer ${
          state.isMuted
            ? 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 shadow-sm shadow-emerald-500/10'
        }`}
        title={state.isMuted ? 'Turn room voice on' : 'Turn room voice off locally'}
      >
        {state.isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span>🔇 VOICE + OOKU SFX OFF</span>
          </>
        ) : (
          <>
            <Volume2 className={`w-3.5 h-3.5 text-emerald-400 ${state.isPlaying ? 'animate-bounce' : ''}`} />
            <span>🔊 VOICE + OOKU SFX ON</span>
            {state.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            )}
          </>
        )}
      </button>
    </div>
  );
}
