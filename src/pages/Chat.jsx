import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChatHeader } from '../components/ChatHeader';
import { ChatMessage } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import { OokuReaction } from '../components/OokuReaction';
import { OokuKillNotification } from '../components/OokuKillNotification';
import { LiveScoreboard } from '../components/LiveScoreboard';
import { LiveDamageCounter } from '../components/LiveDamageCounter';
import { BackgroundFloatingEmojis } from '../components/BackgroundFloatingEmojis';
import { EndChatModal } from '../components/EndChatModal';
import { 
  sendMessage, 
  recordOokuEvent, 
  fetchRoomDetails, 
  subscribeToRoom, 
  endRoomSession 
} from '../services/supabase';
import { getParticipantSession } from '../utils/roomStorage';
import { analyzeChatMessage, calculateOokuDamage } from '../services/aiService';
import { detectCombo } from '../utils/comboDetector';
import { audioQueue } from '../services/audioQueue';
import { Radio, Eye, UserPlus, Flame, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

const REFEREE_COMMENTARY = [
  "👀 AI referee is taking notes...",
  "📝 Interesting choice of words.",
  "😭 That one definitely landed.",
  "🤨 We need to investigate this friendship.",
  "🔥 Things are escalating.",
  "💀 Nobody asked for that.",
  "💀 HR has been informed.",
  "👨‍⚖️ The AI court is currently reviewing this.",
  "🚨 Friendship stability: questionable"
];

function isDuplicate(list, item) {
  if (!item || !item.id) return false;
  return list.some((m) => m.id === item.id);
}

export function Chat() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExplicitDemo = searchParams.get('demo') === 'true';

  const [sessionInfo] = useState(() => getParticipantSession(roomCode));
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [ookuEvents, setOokuEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [refereeNote, setRefereeNote] = useState(null);

  // Comedy UI Animation & State
  const [activeKillEvent, setActiveKillEvent] = useState(null);
  const [isScreenShaking, setIsScreenShaking] = useState(false);
  const [isMobileScoreboardOpen, setIsMobileScoreboardOpen] = useState(false);
  
  const messagesEndRef = useRef(null);
  const mainContainerRef = useRef(null);

  const triggerOokuAnimationEffects = (event) => {
    if (!event || !event.isOoku) return;
    
    // Kill Notification Overlay
    setActiveKillEvent(event);

    // Screen Shake
    setIsScreenShaking(true);
    setTimeout(() => setIsScreenShaking(false), 650);
  };

  const preloadDemoMessages = () => {
    const demoMsgs = [
      { id: 'd1', sender_name: 'Adil', message: 'Da evideya?', created_at: new Date(Date.now() - 30000).toISOString() },
      { id: 'd2', sender_name: 'Muhammad Thoufeeq', message: 'Padichu da 😂', created_at: new Date(Date.now() - 24000).toISOString() },
      { id: 'd3', sender_name: 'Adil', message: 'Ninte notes alla... athukondu padichu 😭', created_at: new Date(Date.now() - 18000).toISOString() },
      { id: 'd4', sender_name: 'Suhail', message: 'Poda mandan 😂', created_at: new Date(Date.now() - 12000).toISOString() },
      { id: 'd5', sender_name: 'Adil', message: 'Nee thanne aanallo 💀', created_at: new Date(Date.now() - 6000).toISOString() }
    ];

    const demoEvents = [
      { id: 'e1', type: 'OOKU', isOoku: true, speaker: 'Adil', target: 'Muhammad Thoufeeq', intensity: 8, message_id: 'd3', created_at: new Date(Date.now() - 18000).toISOString() },
      { id: 'e2', type: 'COUNTER_OOKU', isOoku: true, speaker: 'Suhail', target: 'Adil', intensity: 7, message_id: 'd4', created_at: new Date(Date.now() - 12000).toISOString() },
      { id: 'e3', type: 'CRITICAL_OOKU', isOoku: true, speaker: 'Adil', target: 'Suhail', intensity: 9, message_id: 'd5', created_at: new Date(Date.now() - 6000).toISOString() }
    ];

    setMessages(demoMsgs);
    setOokuEvents(demoEvents);
  };

  const scrollToBottom = (force = false) => {
    if (!mainContainerRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = mainContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
    if (force || isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let unsubscribe = () => {};

    async function initRoom() {
      setIsLoading(true);
      try {
        const details = await fetchRoomDetails(roomCode);
        
        if (details.members && details.members.length > 0) {
          setMembers(details.members.map(m => typeof m === 'string' ? m : m.name));
        } else {
          setMembers([sessionInfo.name]);
        }

        if (isExplicitDemo && (!details.messages || details.messages.length === 0)) {
          preloadDemoMessages();
          audioQueue.initRoom(details.roomId, roomCode, []);
        } else {
          setMessages(details.messages || []);
          setOokuEvents(details.ookuEvents || []);
          audioQueue.initRoom(details.roomId, roomCode, details.messages || []);
        }

        // Realtime subscription listening specifically to current room_id
        unsubscribe = subscribeToRoom(
          roomCode,
          details.roomId,
          (newMsg) => {
            setMessages((prev) => {
              if (isDuplicate(prev, newMsg)) return prev;
              const next = [...prev, newMsg];
              return next.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
            });

            // Queue Gemini TTS speech for incoming message
            audioQueue.queueSpeech(newMsg, details.roomId, roomCode);
          },
          (newMember) => {
            const name = typeof newMember === 'string' ? newMember : newMember.name;
            if (name) {
              setMembers((prev) => (prev.includes(name) ? prev : [...prev, name]));
              
              const joinSysMsg = {
                id: `sys_${name}_${newMember.joined_at || Date.now()}`,
                isSystem: true,
                text: `🟢 ${name} joined the chat`,
                created_at: newMember.joined_at || new Date().toISOString()
              };

              setMessages((prev) => {
                if (prev.some((m) => m.id === joinSysMsg.id || (m.isSystem && m.text === joinSysMsg.text))) return prev;
                return [...prev, joinSysMsg];
              });
            }
          },
          (newEvent) => {
            setOokuEvents((prev) => {
              if (prev.some((e) => e.id === newEvent.id)) return prev;
              return [newEvent, ...prev];
            });

            // Play audio reaction & trigger comedy animations
            if (newEvent && newEvent.isOoku) {
              audioQueue.queueOokuReaction(newEvent, details.roomId, roomCode);
              triggerOokuAnimationEffects(newEvent);
            }
          },
          () => {
            navigate(`/report/${roomCode}`);
          }
        );
      } catch (err) {
        console.warn("Failed to load room details:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initRoom();

    return () => {
      unsubscribe();
      audioQueue.clearSpeechQueue();
    };
  }, [roomCode, isExplicitDemo]);

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [messages, ookuEvents, refereeNote, isLoading]);

  const handleSendMessage = async (text) => {
    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2,7)}`;
    const tempMsg = {
      id: tempId,
      room_code: roomCode,
      sender_name: sessionInfo.name,
      message: text,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, tempMsg]);
    scrollToBottom(true);

    const newMsg = await sendMessage(roomCode, sessionInfo.name, text);

    if (newMsg) {
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== tempId);
        if (isDuplicate(filtered, newMsg)) return filtered;
        const next = [...filtered, newMsg];
        return next.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      });

      // Queue locally on sender device as well
      audioQueue.queueSpeech(newMsg, null, roomCode);
    }

    // Silent AI Background Analysis (Non-blocking)
    try {
      const recentContext = messages.filter(m => !m.isSystem).slice(-5);
      const aiResult = await analyzeChatMessage(text, recentContext, sessionInfo.name, members);

      if (aiResult && aiResult.isOoku && (aiResult.confidence || 1) >= 0.70) {
        const damage = calculateOokuDamage(aiResult.type, aiResult.intensity);

        const createdEvent = await recordOokuEvent(roomCode, {
          message_id: newMsg ? newMsg.id : null,
          type: aiResult.type,
          isOoku: true,
          intensity: aiResult.intensity,
          confidence: aiResult.confidence,
          damage: damage,
          speaker: aiResult.speaker || sessionInfo.name,
          target: aiResult.target || null
        });

        if (createdEvent) {
          audioQueue.queueOokuReaction(createdEvent, null, roomCode);
          triggerOokuAnimationEffects(createdEvent);
        }

        // Rare Referee Commentary
        if (aiResult.intensity >= 9 || Math.random() > 0.70) {
          const randomComment = REFEREE_COMMENTARY[Math.floor(Math.random() * REFEREE_COMMENTARY.length)];
          setRefereeNote(randomComment);
          setTimeout(() => setRefereeNote(null), 5000);
        }
      }
    } catch (err) {
      console.warn("Silent AI analysis error (chat continues uninterrupted):", err);
    }
  };

  const handleConfirmEndChat = async () => {
    setIsEndModalOpen(false);
    await endRoomSession(roomCode);
    navigate(`/report/${roomCode}`);
  };

  const totalOokuCount = ookuEvents.filter(e => e.isOoku).length;
  const totalDamageCount = ookuEvents.reduce((acc, e) => acc + (Number(e.damage) || ((Number(e.intensity) || 7) * 10)), 0);
  const comboState = detectCombo(ookuEvents);

  return (
    <div className={`min-h-screen bg-[#080812] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#EC4899] transition-all ${isScreenShaking ? 'animate-ooku-screen-shake' : ''}`}>
      {/* Background Floating Emojis */}
      <BackgroundFloatingEmojis />

      {/* AAA Gaming Kill Notification Overlay */}
      {activeKillEvent && (
        <OokuKillNotification
          event={activeKillEvent}
          onClose={() => setActiveKillEvent(null)}
        />
      )}

      {/* Game-style Header */}
      <ChatHeader
        roomCode={roomCode}
        members={members}
        ookuCount={totalOokuCount}
        totalDamage={totalDamageCount}
        isCreator={sessionInfo.isCreator}
        onOpenEndModal={() => setIsEndModalOpen(true)}
      />

      {/* Mobile Collapsible Scoreboard Drawer Button */}
      <div className="lg:hidden bg-[#11111F] border-b border-purple-500/20 px-4 py-2 flex items-center justify-between z-30">
        <button
          onClick={() => setIsMobileScoreboardOpen(!isMobileScoreboardOpen)}
          className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5 cursor-pointer"
        >
          <Flame className="w-4 h-4 text-[#FF3B5C]" />
          <span>LIVE SCOREBOARD & DAMAGE</span>
          {isMobileScoreboardOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <span className="text-xs font-mono font-extrabold text-[#FF3B5C]">
          💀 {totalDamageCount.toLocaleString()} DAMAGE
        </span>
      </div>

      {/* Mobile Collapsible Scoreboard Content */}
      {isMobileScoreboardOpen && (
        <div className="lg:hidden p-4 bg-[#11111F] border-b border-purple-500/30 animate-fadeIn z-30 space-y-4">
          <LiveScoreboard ookuEvents={ookuEvents} members={members} />
          <LiveDamageCounter totalDamage={totalDamageCount} />
        </div>
      )}

      {/* Main 3-Zone Layout Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 overflow-hidden">
        {/* Left Panel (Desktop Scoreboard) */}
        <aside className="hidden lg:block lg:col-span-3 cyber-glass rounded-3xl p-5 border border-purple-500/20 space-y-4 h-fit sticky top-20">
          <LiveScoreboard ookuEvents={ookuEvents} members={members} />
        </aside>

        {/* Center Panel (Dominant Chat Stream) */}
        <main ref={mainContainerRef} className="lg:col-span-6 flex flex-col h-[calc(100vh-140px)] cyber-glass rounded-3xl border border-purple-500/20 overflow-hidden relative">
          {/* Messages Stream Content */}
          <div className="flex-1 p-4 sm:p-6 space-y-4 overflow-y-auto">
            {/* Initial System Notice */}
            <div className="text-center py-2 space-y-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#19192B] border border-purple-500/30 text-xs font-mono text-purple-200 shadow-md">
                <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>The AI referee has entered the room. It will remain silent until someone says something questionable.</span>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3 font-mono text-purple-300">
                <Flame className="w-10 h-10 text-[#FF3B5C] animate-spin mx-auto" />
                <p className="text-base">Loading the chaos... 👀</p>
              </div>
            ) : messages.length === 0 ? (
              /* Empty Chat State */
              <div className="py-20 text-center space-y-3 text-slate-500">
                <div className="p-4 rounded-3xl bg-[#19192B] border border-purple-500/20 text-purple-400 inline-block mb-1">
                  <Radio className="w-10 h-10 animate-pulse" />
                </div>
                <h3 className="text-2xl font-extrabold font-mono text-white">
                  It's suspiciously quiet. 👀
                </h3>
                <p className="text-sm font-mono text-purple-300">
                  Somebody say something questionable.
                </p>
              </div>
            ) : (
              /* Messages Stream */
              messages.map((msg, index) => {
                if (msg.isSystem) {
                  return (
                    <div key={msg.id || `sys_${index}`} className="my-2.5 flex justify-center animate-fadeIn">
                      <span className="px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs sm:text-sm font-mono text-emerald-300 flex items-center gap-2 shadow-md">
                        <UserPlus className="w-4 h-4 text-emerald-400" />
                        <span>{msg.text}</span>
                      </span>
                    </div>
                  );
                }

                const isUser = msg.sender_name === sessionInfo.name;
                const matchingEvent = ookuEvents.find(
                  (e) => (e.message_id && e.message_id === msg.id) || (e.message && e.message === msg.message)
                );

                return (
                  <React.Fragment key={msg.id || `msg_${index}`}>
                    {/* Original Message (Always Visible) */}
                    <ChatMessage
                      message={msg}
                      isCurrentUser={isUser}
                      isOokuTarget={Boolean(matchingEvent && matchingEvent.isOoku)}
                    />

                    {/* Non-destructive Inline Ooku Reaction Attached Below */}
                    {matchingEvent && matchingEvent.isOoku && (
                      <OokuReaction
                        event={matchingEvent}
                        comboText={comboState.comboText}
                      />
                    )}
                  </React.Fragment>
                );
              })
            )}

            {/* Intermittent Referee Commentary */}
            {refereeNote && (
              <div className="my-3 flex justify-center animate-fadeIn">
                <span className="px-4 py-1.5 rounded-full bg-[#19192B] border border-cyan-500/40 text-xs sm:text-sm font-mono font-semibold text-cyan-300 shadow-xl">
                  {refereeNote}
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Composer Input */}
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            userName={sessionInfo.name || "Someone"}
          />
        </main>

        {/* Right Panel (Desktop Damage & Telemetry) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 h-fit sticky top-20">
          <LiveDamageCounter totalDamage={totalDamageCount} />

          {/* System Status Card */}
          <div className="cyber-glass rounded-3xl p-5 border border-purple-500/20 space-y-3">
            <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-cyan-300 uppercase">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>ROOM TELEMETRY</span>
            </div>

            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="flex justify-between py-1 border-b border-purple-500/10">
                <span>Room Code</span>
                <span className="font-bold text-white">{roomCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-500/10">
                <span>Active Combo</span>
                <span className="font-bold text-rose-400">{comboState.comboText || 'None'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-purple-500/10">
                <span>AI Referee</span>
                <span className="font-bold text-emerald-400">ONLINE 🟢</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* End Chat Confirmation Modal */}
      <EndChatModal
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleConfirmEndChat}
      />
    </div>
  );
}
