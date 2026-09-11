import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Globe, AlertCircle } from 'lucide-react';
import { ttsService } from '../services/ttsService';

export function AudioControls() {
  const [state, setState] = useState(() => ttsService.getState());

  useEffect(() => {
    const unsubscribe = ttsService.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  if (!state.isSupported) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/40 border border-amber-500/30 text-[11px] font-mono text-amber-300">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Voice reading isn't supported in this browser</span>
      </div>
    );
  }

  // Before user interaction: prompt user to enable audio
  if (!state.isEnabled) {
    return (
      <button
        onClick={() => ttsService.enableAudio()}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-600/30 to-rose-600/30 hover:from-cyan-500/40 hover:to-rose-500/40 border border-cyan-400/40 text-cyan-200 hover:text-white text-xs font-mono font-bold tracking-wide transition-all shadow-md hover:shadow-cyan-500/20 active:scale-95 cursor-pointer animate-pulse"
        title="Click to enable live text-to-speech for room messages"
      >
        <Volume2 className="w-3.5 h-3.5 text-cyan-300" />
        <span>🔊 Enable Room Audio</span>
      </button>
    );
  }

  // Active state: Audio ON / Muted + Manglish / Malayalam Language Mode Toggle
  return (
    <div className="flex items-center gap-1.5">
      {/* Audio Mute/Unmute Toggle */}
      <button
        onClick={() => ttsService.toggleMute()}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono font-medium transition-all cursor-pointer ${
          state.isMuted
            ? 'bg-slate-900/90 border-slate-700 text-slate-400 hover:text-slate-200'
            : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 shadow-sm shadow-emerald-500/10'
        }`}
        title={state.isMuted ? 'Unmute room audio' : 'Mute room audio locally'}
      >
        {state.isMuted ? (
          <>
            <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            <span>🔇 Room Audio Muted</span>
          </>
        ) : (
          <>
            <Volume2 className={`w-3.5 h-3.5 text-emerald-400 ${state.isSpeaking ? 'animate-bounce' : ''}`} />
            <span>🔊 Room Audio ON</span>
            {state.isSpeaking && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-0.5" />
            )}
          </>
        )}
      </button>

      {/* Manglish vs Native Malayalam Toggle Button */}
      <button
        onClick={() => ttsService.toggleLanguageMode()}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer shadow-sm"
        title="Toggle between Manglish and Native Malayalam script for room voice"
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span>{state.languageMode === 'malayalam' ? '💬 മലയാളം' : '🇲🇱 Manglish'}</span>
      </button>
    </div>
  );
}
