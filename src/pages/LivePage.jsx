import React from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { StatCard } from '../components/ui/StatCard';
import { Button } from '../components/ui/Button';
import { MicHeroCard } from '../components/live/MicHeroCard';
import { ParticipantsBar } from '../components/live/ParticipantsBar';
import { TranscriptPanel } from '../components/live/TranscriptPanel';
import { AiEventPanel } from '../components/live/AiEventPanel';
import { useLiveSession } from '../hooks/useLiveSession';
import { ArrowLeft, Flame, Zap, Award, Activity, AlertCircle } from 'lucide-react';

export function LivePage() {
  const {
    squad,
    isListening,
    isAnalyzing,
    aiError,
    ookuCount,
    currentStreak,
    maxStreak,
    togglePause,
    endSession,
    timerFormatted,
    transcripts,
    aiEvents,
    addMockTranscript,
    addMockAiEvent
  } = useLiveSession();

  return (
    <PageContainer
      isListening={isListening}
      headerAction={
        <Button
          variant="ghost"
          size="sm"
          icon={ArrowLeft}
          onClick={endSession}
        >
          Edit Squad
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Error Alert if AI or Speech Service encounters issue */}
        {aiError && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{aiError}</span>
            </div>
          </div>
        )}

        {/* Participants Bar */}
        <ParticipantsBar squad={squad} />

        {/* Real-time Ooku Metrics & Streak Counter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Ookus Detected"
            value={`${ookuCount} Roasts`}
            subtext="Live conversation roasts intercepted"
            icon={Flame}
            color="rose"
            trend={ookuCount > 0 ? `+${ookuCount}` : "0"}
          />

          <StatCard
            title="Current Ooku Streak"
            value={`🔥 ${currentStreak}`}
            subtext={`Best Streak: ${maxStreak} consecutive`}
            icon={Zap}
            color={currentStreak > 0 ? "amber" : "cyan"}
            trend={currentStreak > 0 ? "ACTIVE STREAK" : "STANDBY"}
          />

          <StatCard
            title="AI Pipeline Status"
            value={isAnalyzing ? "Analyzing..." : "Ready"}
            subtext="Real-time Malayalam NLP engine"
            icon={Activity}
            color={isAnalyzing ? "cyan" : "emerald"}
          />

          <StatCard
            title="Session Mode"
            value="Speech -> AI"
            subtext="Real-time deduplicated analysis"
            icon={Award}
            color="purple"
          />
        </div>

        {/* Hero Card: Large Animated Microphone, Status, Session Timer & Controls */}
        <MicHeroCard
          isListening={isListening}
          onTogglePause={togglePause}
          onEndSession={endSession}
          timerFormatted={timerFormatted}
        />

        {/* Dual Panel Layout: Live Transcripts & AI Event Detector */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TranscriptPanel
            transcripts={transcripts}
            onSimulate={addMockTranscript}
          />
          
          <AiEventPanel
            aiEvents={aiEvents}
            onSimulate={addMockAiEvent}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </PageContainer>
  );
}
