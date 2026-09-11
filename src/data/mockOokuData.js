/**
 * Mock Data for Friendship OS - Ooku Detector
 * Contains sample Malayalam/Manglish teasing triggers, reactions, and intensity metrics.
 */

export const MOCK_OOKU_PHRASES = [
  {
    id: 1,
    speaker: "Rahul",
    text: "Enikku BMW vaangaanulla cash undu bro...",
    translated: "I have money to buy a BMW bro...",
    isOoku: true,
    roast: "Nee valiya thallukaran aano? 🚗💨",
    intensity: 85,
    reactionEmoji: "🤣",
    timestamp: "10:42:15 AM",
    type: "THALLU_DETECTED"
  },
  {
    id: 2,
    speaker: "Anjali",
    text: "Njan innu 5 hrs workout cheythu!",
    translated: "I worked out for 5 hours today!",
    isOoku: true,
    roast: "Sheney! Aano da? Gymil poyi irunn urangiyatano? 💪💤",
    intensity: 92,
    reactionEmoji: "💀",
    timestamp: "10:42:22 AM",
    type: "OVEREXAGGERATION"
  },
  {
    id: 3,
    speaker: "Kiran",
    text: "Njan code ezhuthiyaal bugs onnum undavilla.",
    translated: "When I write code, there are no bugs.",
    isOoku: true,
    roast: "Enna pinne pinne choikyaam! Production crash aakumbol parayam 🔥",
    intensity: 98,
    reactionEmoji: "🤡",
    timestamp: "10:42:30 AM",
    type: "DEV_CONFIDENCE"
  },
  {
    id: 4,
    speaker: "Rahul",
    text: "Guys, tea break eduthaalo?",
    translated: "Guys, shall we take a tea break?",
    isOoku: false,
    roast: "Normal conversation detected. No Ooku present.",
    intensity: 12,
    reactionEmoji: "☕",
    timestamp: "10:42:38 AM",
    type: "NORMAL"
  }
];

export const SYSTEM_STATUSES = {
  IDLE: { label: "OS Standby", color: "text-slate-400", bg: "bg-slate-800/50" },
  LISTENING: { label: "Eavesdropping...", color: "text-cyan-400", bg: "bg-cyan-950/50 border-cyan-500/30" },
  ANALYZING: { label: "AI Roast Engine Active", color: "text-amber-400", bg: "bg-amber-950/50 border-amber-500/30" },
  OOKU_DETECTED: { label: "OOKU DETECTED! 🚨", color: "text-rose-400", bg: "bg-rose-950/50 border-rose-500/40" },
};
