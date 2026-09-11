import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/ui/PageContainer';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/ui/StatCard';
import { getSavedSquad, saveSquad } from '../utils/squadStorage';
import { Users, UserPlus, Trash2, CheckCircle2, Mic, Sparkles, AlertCircle } from 'lucide-react';

export function SquadPage() {
  const navigate = useNavigate();
  const [squad, setSquad] = useState(() => getSavedSquad());
  const [selectedParticipants, setSelectedParticipants] = useState(() => getSavedSquad());
  const [newFriendName, setNewFriendName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddFriend = (e) => {
    e.preventDefault();
    const name = newFriendName.trim();
    if (!name) return;
    
    if (squad.some(n => n.toLowerCase() === name.toLowerCase())) {
      setErrorMsg(`"${name}" is already in your friend list!`);
      return;
    }

    const updatedSquad = [...squad, name];
    setSquad(updatedSquad);
    setSelectedParticipants(prev => [...prev, name]);
    saveSquad(updatedSquad);
    setNewFriendName('');
    setErrorMsg('');
  };

  const handleRemoveFriend = (nameToRemove) => {
    const updatedSquad = squad.filter(n => n !== nameToRemove);
    setSquad(updatedSquad);
    const updatedSelected = selectedParticipants.filter(n => n !== nameToRemove);
    setSelectedParticipants(updatedSelected);
    saveSquad(updatedSquad);

    if (updatedSelected.length < 2) {
      setErrorMsg('Select at least 2 participants for Ooku roasting detection.');
    } else {
      setErrorMsg('');
    }
  };

  const toggleParticipantSelection = (name) => {
    let updated;
    if (selectedParticipants.includes(name)) {
      updated = selectedParticipants.filter(n => n !== name);
    } else {
      updated = [...selectedParticipants, name];
    }
    setSelectedParticipants(updated);

    if (updated.length < 2) {
      setErrorMsg('Select at least 2 participants for Ooku roasting detection.');
    } else {
      setErrorMsg('');
    }
  };

  const handleStartListening = () => {
    if (selectedParticipants.length < 2) {
      setErrorMsg('You must select at least 2 participants to start listening!');
      return;
    }
    saveSquad(selectedParticipants);
    navigate('/live');
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-2 py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>SESSION SETUP • STEP 1 OF 2</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Assemble Your Roast Squad
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-sans">
            Add your friends who will be talking near the microphone. Friendship OS will analyze speech and trigger playful Malayalam roasts!
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Current Squad Size"
            value={`${squad.length} Friends`}
            subtext="Available in participant pool"
            icon={Users}
            color="cyan"
          />
          <StatCard
            title="Active Participants"
            value={`${selectedParticipants.length} Selected`}
            subtext="Ready for mic listening"
            icon={CheckCircle2}
            color={selectedParticipants.length >= 2 ? "emerald" : "amber"}
          />
          <StatCard
            title="Minimum Required"
            value="2 Members"
            subtext="Needed for banter detection"
            icon={Sparkles}
            color="purple"
          />
        </div>

        {/* Main Card: Friend Management */}
        <Card 
          title="Squad Members" 
          subtitle="Click participant badges to select/deselect who is speaking in this session"
          icon={Users}
        >
          {/* Add Friend Input Form */}
          <form onSubmit={handleAddFriend} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={newFriendName}
              onChange={(e) => {
                setNewFriendName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Enter friend's name (e.g. Abhi, Vivek)..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500/60 focus:outline-none text-sm text-white placeholder-slate-500 font-sans"
            />
            <Button
              type="submit"
              variant="cyber"
              size="md"
              icon={UserPlus}
            >
              Add Friend
            </Button>
          </form>

          {/* Validation Warning Alert */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Squad Participant Pills Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Select Participants ({selectedParticipants.length} / {squad.length} Active):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {squad.map((name) => {
                const isSelected = selectedParticipants.includes(name);
                return (
                  <div
                    key={name}
                    className={`p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between group cursor-pointer select-none ${
                      isSelected 
                        ? 'bg-cyan-950/50 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10' 
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                    onClick={() => toggleParticipantSelection(name)}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600 bg-transparent'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <span className="font-semibold text-sm truncate">{name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFriend(name);
                      }}
                      className="opacity-60 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title={`Remove ${name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Large Primary Action Button */}
        <div className="pt-4 flex flex-col items-center justify-center">
          <Button
            variant="danger"
            size="lg"
            icon={Mic}
            isPulse={selectedParticipants.length >= 2}
            disabled={selectedParticipants.length < 2}
            onClick={handleStartListening}
            className="w-full sm:w-auto text-lg md:text-xl py-4 px-10 rounded-2xl shadow-xl shadow-rose-600/30"
          >
            🎙️ Start Listening
          </Button>

          <p className="text-xs font-mono text-slate-500 mt-3">
            Clicking will initiate the real-time speech monitoring dashboard.
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
