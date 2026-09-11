import React from 'react';
import { Mic, MicOff, Pause, Play, Square, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AudioVisualizer } from '../AudioVisualizer';

export function MicHeroCard({
  isListening,
  onTogglePause,
  onEndSession,
  timerFormatted
}) {
  return (
    <div className="cyber-glass rounded-2xl p-6 border border-slate-800 relative overflow-hidden cyber-corner shadow-2xl">
      {/* Background Glow Ring */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-20 ${
          isListening ? 'bg-cyan-500' : 'bg-rose-500'
        }`}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Animated Mic Button & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Large Animated Microphone Button */}
          <div className="relative group">
            {isListening && (
              <div className="absolute -inset-3 rounded-full bg-cyan-500/20 animate-ping pointer-events-none" />
            )}
            
            <button
              onClick={onTogglePause}
              className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer relative z-10 ${
                isListening
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/40 hover:scale-105'
                  : 'bg-gradient-to-br from-rose-600 to-amber-600 text-white shadow-rose-600/30 hover:scale-105'
              }`}
              title={isListening ? "Click to Pause" : "Click to Resume"}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-pulse" />
              ) : (
                <MicOff className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Listening Status & Session Timer */}
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1.5">
              <Badge 
                variant={isListening ? "cyan" : "rose"} 
                pulse={isListening}
              >
                {isListening ? "LISTENING FOR BANTER..." : "SESSION PAUSED"}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-mono text-white tracking-wide">
              {isListening ? "Real-time Speech Monitoring" : "Microphone Inactive"}
            </h2>

            {/* Session Timer readout */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-slate-400 font-mono text-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Session Duration:</span>
              <span className="text-sm font-bold text-cyan-300 font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {timerFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Audio Waveform Spectrum */}
        <div className="w-full lg:w-72">
          <AudioVisualizer isListening={isListening} />
        </div>

        {/* Right: Controls (Pause / End Session) */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <Button
            variant={isListening ? "ghost" : "success"}
            size="md"
            icon={isListening ? Pause : Play}
            onClick={onTogglePause}
          >
            {isListening ? "Pause" : "Resume"}
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={Square}
            onClick={onEndSession}
          >
            End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
