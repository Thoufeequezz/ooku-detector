import React, { useState } from 'react';
import { PageContainer } from '../components/ui/PageContainer';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Toast } from '../components/ui/Toast';
import { OokuMeter } from '../components/OokuMeter';
import { AudioVisualizer } from '../components/AudioVisualizer';
import { ReactionCard } from '../components/ReactionCard';
import { LiveFeed } from '../components/LiveFeed';
import { useMockSpeech } from '../hooks/useMockSpeech';
import { 
  Flame, 
  Mic, 
  MicOff, 
  Play, 
  Cpu, 
  Activity, 
  Volume2, 
  Zap, 
  Info,
  Bell
} from 'lucide-react';

export function HomePage() {
  const { isListening, toggleListening, feed, activePhrase, triggerNextRoast } = useMockSpeech();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  return (
    <PageContainer isListening={isListening}>
      {/* Top Hackathon Presentation Large KPI StatCards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Ooku Precision"
          value="98.4%"
          subtext="Trained on 5,000+ Manglish roasts"
          icon={Flame}
          color="rose"
          trend="+4.2%"
        />
        <StatCard
          title="Ookus Intercepted"
          value={feed.length}
          subtext="Live conversation roasts detected"
          icon={Zap}
          color="cyan"
          trend="Real-time"
        />
        <StatCard
          title="AI Response Time"
          value="0.18s"
          subtext="Ultra-low latency counter-roast"
          icon={Activity}
          color="amber"
          trend="Instant"
        />
        <StatCard
          title="Friendship Meter"
          value="Danger 🚨"
          subtext="Friendship under intense teasing"
          icon={Cpu}
          color="purple"
          trend="Extreme"
        />
      </section>

      {/* Hero Control Bar & Visualizer */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card 
          title="Microphone Eavesdropper" 
          subtitle="Real-time speech listener module"
          icon={Mic}
          className="lg:col-span-2"
          action={
            <Badge variant={isListening ? "rose" : "slate"} pulse={isListening}>
              {isListening ? "RECORDING" : "MUTED"}
            </Badge>
          }
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            <div className="flex items-center gap-4">
              <Button
                variant={isListening ? "danger" : "cyber"}
                size="lg"
                icon={isListening ? MicOff : Mic}
                isPulse={isListening}
                onClick={toggleListening}
              >
                {isListening ? "Stop Eavesdropping" : "Activate Mic Listener"}
              </Button>

              <Button
                variant="ghost"
                size="md"
                icon={Play}
                onClick={triggerNextRoast}
              >
                Simulate Next Roast
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                icon={Info}
                onClick={() => setIsModalOpen(true)}
              >
                Model Parameters
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                icon={Bell}
                onClick={() => setIsToastOpen(true)}
              >
                Trigger Alert Toast
              </Button>
            </div>
          </div>
        </Card>

        <Card 
          title="Audio Stream Spectrum" 
          subtitle="Real-time voice frequency breakdown"
          icon={Volume2}
          hasCorners={false}
        >
          <AudioVisualizer isListening={isListening} />
        </Card>
      </section>

      {/* Ooku Intensity Meter & Core Reaction Card Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 space-y-6">
          <ReactionCard phrase={activePhrase} />
        </div>

        <div className="space-y-6">
          <OokuMeter intensity={activePhrase ? activePhrase.intensity : 0} />
          <LiveFeed feed={feed} />
        </div>
      </section>

      {/* Presentation System Parameter Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Friendship OS • Roast Model Configuration"
        subtitle="AI Malayalam & Manglish Classifier Settings"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Close
            </Button>
            <Button variant="cyber" size="sm" onClick={() => setIsModalOpen(false)}>
              Apply Preset
            </Button>
          </>
        }
      >
        <div className="space-y-4 font-mono text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>Primary Dialect Engine:</span>
            <Badge variant="cyan">Malayalam / Manglish v4.2</Badge>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>Roast Severity Level:</span>
            <Badge variant="rose">Savage (Hackathon Edition)</Badge>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
            <span>Speech Recognition Threshold:</span>
            <span className="text-cyan-400 font-bold">95.8% Sensitivity</span>
          </div>
        </div>
      </Modal>

      {/* Demo Toast Notification */}
      <Toast
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
        title="OOKU DETECTED! 🚨"
        message="Rahul just dropped an extreme overexaggeration roast!"
        type="rose"
        actionLabel="Inspect Roast Details"
        onAction={() => {
          setIsToastOpen(false);
          triggerNextRoast();
        }}
      />
    </PageContainer>
  );
}
