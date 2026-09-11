/**
 * Friendship OS - Real-Time Text-to-Speech (TTS) Service
 * Supports dual language modes for room speech:
 * 1. Manglish (Malayalam written in English script)
 * 2. Native Malayalam (മലയാളം script)
 */

const MANGLISH_INTROS = [
  (name) => `${name} parayunnu...`,
  (name) => `Aliya, ${name} parayunnu...`,
  (name) => `Ok guys, ${name} entho parayunnund...`,
  (name) => `Shari... ${name}inte message vannu...`,
  (name) => `Eda, ${name} parayunnathu kelkku...`,
  (name) => `Mone, ${name} message aychirukkunnu...`
];

const MALAYALAM_INTROS = [
  (name) => `${name} പറയുന്നു...`,
  (name) => `അളിയാ, ${name} പറയുന്നു...`,
  (name) => `ഓക്കെ ഗയ്സ്, ${name} എന്തോ പറയുന്നുണ്ട്...`,
  (name) => `ശരി... ${name}ന്റെ മെസ്സേജ് വന്നു...`,
  (name) => `എടാ, ${name} പറയുന്നത് കേൾക്കൂ...`,
  (name) => `മോനേ, ${name} മെസ്സേജ് അയച്ചിരിക്കുന്നു...`
];

const MANGLISH_OOKU_REACTIONS = [
  "Ayyoo... direct hit aanallo! 😂",
  "Eda mone, athu kurachu koodi poyi!",
  "Ayyo... ithu personal aayi! 💀",
  "Polichu! Ooku nannayi landed!",
  "Eda... friendship ippo safe alla!",
  "Ithu kettittu njan onnum parayunnilla 😂",
  "Ohooo... counter varum!",
  "Mone, ithu heavy damage aanu 💀",
  "Ayyo ayyo... friendship theernnu!",
  "Daivame... enthokkeya ee parayunne!",
  "Ohooo... ivide scene vere aanu!",
  "Eda, counter varum ketto!",
  "Heavy ooku aanu mone!",
  "Ithu kurachu over aayi poyi 😂"
];

const MALAYALAM_OOKU_REACTIONS = [
  "അയ്യോ... ഡയറക്റ്റ് ഹിറ്റ് ആണല്ലോ! 😂",
  "എടാ മോനേ, അത് കുറച്ച് കൂടി പോയി!",
  "അയ്യോ... ഇത് പേഴ്സണൽ ആയി! 💀",
  "പൊളിച്ചു! ഊക്ക് നന്നായി ലാൻഡഡ് ആയി!",
  "എടാ... ഫ്രണ്ട്ഷിപ്പ് ഇപ്പോൾ സേഫ് അല്ല!",
  "ഇത് കേട്ടിട്ട് ഞാൻ ഒന്നും പറയുന്നില്ല 😂",
  "ഒഹോ... കൗണ്ടർ വരും!",
  "മോനേ, ഇത് ഹെവി ഡാമേജ് ആണ് 💀",
  "അയ്യോ അയ്യോ... ഫ്രണ്ട്ഷിപ്പ് തീർന്നു!",
  "ദൈവമേ... എന്തൊക്കെയാ ഈ പറയുന്നേ!",
  "ഒഹോ... ഇവിടെ സീൻ വേറെ ആണ്!",
  "എടാ, കൗണ്ടർ വരും കേട്ടോ!",
  "ഹെവി ഊക്ക് ആണ് മോനേ!",
  "ഇത് കുറച്ച് ഓവർ ആയി പോയി 😂"
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

class TTSService {
  constructor() {
    this.spokenMessageIds = new Set();
    this.spokenEventIds = new Set();
    this.queue = [];
    this.isSpeaking = false;
    this.isEnabled = false;
    this.muted = false;
    this.languageMode = 'manglish'; // 'manglish' | 'malayalam'
    this.currentRoomId = null;
    this.currentRoomCode = null;
    this.listeners = new Set();
    this.voices = [];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  loadVoices() {
    if (!this.isSupported()) return;
    try {
      this.voices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      console.warn('[TTSService] Could not fetch voices:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  getState() {
    return {
      isSupported: this.isSupported(),
      isEnabled: this.isEnabled,
      isMuted: this.muted,
      isSpeaking: this.isSpeaking,
      languageMode: this.languageMode,
      queueLength: this.queue.length
    };
  }

  setLanguageMode(mode) {
    if (mode === 'manglish' || mode === 'malayalam') {
      this.languageMode = mode;
      this.notify();
    }
  }

  toggleLanguageMode() {
    this.languageMode = this.languageMode === 'manglish' ? 'malayalam' : 'manglish';
    this.notify();
  }

  /**
   * Called when entering a room to set room context & prevent reading historic messages
   */
  initRoom(roomId, roomCode, existingMessages = []) {
    this.currentRoomId = roomId;
    this.currentRoomCode = roomCode ? roomCode.trim().toUpperCase() : null;
    this.seedExistingMessageIds(existingMessages);
  }

  seedExistingMessageIds(messages = []) {
    messages.forEach((msg) => {
      if (msg && msg.id) {
        this.spokenMessageIds.add(msg.id);
      }
    });
  }

  enableAudio() {
    if (!this.isSupported()) return;

    this.isEnabled = true;
    this.muted = false;

    // Autoplay unlock: speak a silent empty utterance on user click
    try {
      window.speechSynthesis.cancel();
      const dummy = new SpeechSynthesisUtterance('');
      dummy.volume = 0;
      window.speechSynthesis.speak(dummy);
    } catch (e) {
      console.warn('[TTSService] Autoplay unlock attempt:', e);
    }

    this.notify();
    this.processQueue();
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      this.queue = [];
      this.isSpeaking = false;
    }
    this.notify();
    if (!this.muted) {
      this.processQueue();
    }
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    if (this.muted && this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
      this.queue = [];
      this.isSpeaking = false;
    }
    this.notify();
    if (!this.muted) {
      this.processQueue();
    }
  }

  /**
   * Main entry point to speak a newly received message
   */
  speakMessage(msg, targetRoomId = null, targetRoomCode = null) {
    if (!this.isSupported()) return;
    if (!msg || !msg.id) return;

    // Ignore system messages or messages without text
    if (msg.isSystem || (!msg.message && !msg.text)) return;

    // 1. Deduplication check
    if (this.spokenMessageIds.has(msg.id)) {
      return;
    }

    // 2. Room isolation check
    const activeRoomId = targetRoomId || this.currentRoomId;
    const activeRoomCode = targetRoomCode ? targetRoomCode.trim().toUpperCase() : this.currentRoomCode;

    if (msg.room_id && activeRoomId && msg.room_id !== activeRoomId) {
      return;
    }
    if (msg.room_code && activeRoomCode && msg.room_code.trim().toUpperCase() !== activeRoomCode) {
      return;
    }

    this.spokenMessageIds.add(msg.id);

    const senderName = msg.sender_name || 'Aliya';
    const rawText = msg.message || msg.text || '';

    // 3. Long Message Protection (> 300 chars)
    let spokenText = rawText.trim();
    if (spokenText.length > 300) {
      spokenText = spokenText.substring(0, 300) + (this.languageMode === 'malayalam' ? '... ബാക്കി ചാറ്റിൽ ഉണ്ട്.' : '... message continues in chat.');
    }

    // 4. Intro prefix based on language mode
    const introPool = this.languageMode === 'malayalam' ? MALAYALAM_INTROS : MANGLISH_INTROS;
    const randomIntroFn = getRandomItem(introPool);
    const introPrefix = randomIntroFn(senderName);
    const fullSpeechText = `${introPrefix} ${spokenText}`;

    // Add to speech queue
    this.queue.push({
      id: msg.id,
      text: fullSpeechText,
      langMode: this.languageMode,
      isOoku: false
    });

    this.notify();
    this.processQueue();
  }

  /**
   * Speak a funny Ooku reaction line after an Ooku event is detected
   */
  speakOokuReaction(event, targetRoomId = null, targetRoomCode = null) {
    if (!this.isSupported()) return;
    if (!event || (!event.id && !event.message_id)) return;
    if (!event.isOoku) return;

    const eventKey = event.id || `ooku_${event.message_id}`;
    if (this.spokenEventIds.has(eventKey)) {
      return;
    }

    // Room isolation check
    const activeRoomId = targetRoomId || this.currentRoomId;
    const activeRoomCode = targetRoomCode ? targetRoomCode.trim().toUpperCase() : this.currentRoomCode;

    if (event.room_id && activeRoomId && event.room_id !== activeRoomId) {
      return;
    }
    if (event.room_code && activeRoomCode && event.room_code.trim().toUpperCase() !== activeRoomCode) {
      return;
    }

    this.spokenEventIds.add(eventKey);

    const reactionPool = this.languageMode === 'malayalam' ? MALAYALAM_OOKU_REACTIONS : MANGLISH_OOKU_REACTIONS;
    const reactionText = getRandomItem(reactionPool);

    // Queue reaction after current message finishes
    this.queue.push({
      id: eventKey,
      text: reactionText,
      langMode: this.languageMode,
      isOoku: true
    });

    this.notify();
    this.processQueue();
  }

  processQueue() {
    if (!this.isSupported()) return;
    if (this.muted || !this.isEnabled) return;
    if (this.isSpeaking) return;
    if (this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item) return;

    this.isSpeaking = true;
    this.notify();

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const isMalayalamMode = item.langMode === 'malayalam';

    // Voice Selection strategy
    if (this.voices.length > 0) {
      if (isMalayalamMode) {
        // Look specifically for Malayalam voice first (ml-IN)
        const mlVoice = this.voices.find(v => v.lang.includes('ml') || v.name.includes('Malayalam'));
        const inVoice = this.voices.find(v => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Rishi') || v.name.includes('Veena'));
        utterance.voice = mlVoice || inVoice || this.voices[0];
        if (mlVoice) {
          utterance.lang = 'ml-IN';
        }
      } else {
        // Manglish mode: prefer Indian English / Hindi accent for natural Manglish phonetics
        const indianVoice = this.voices.find(
          (v) =>
            v.lang.includes('IN') ||
            v.lang.includes('hi') ||
            v.name.includes('India') ||
            v.name.includes('Rishi') ||
            v.name.includes('Veena') ||
            v.name.includes('Kiran')
        );

        utterance.voice =
          indianVoice ||
          this.voices.find(
            (v) => (v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Alex'))) || v.default
          ) ||
          this.voices[0];
      }
    }

    const finishSpeech = () => {
      this.isSpeaking = false;
      this.notify();
      setTimeout(() => {
        this.processQueue();
      }, 150);
    };

    utterance.onend = finishSpeech;

    utterance.onerror = (event) => {
      console.warn('[TTSService] Speech error:', event);
      finishSpeech();
    };

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('[TTSService] Speak call failed:', err);
      finishSpeech();
    }
  }

  clear() {
    if (this.isSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    this.queue = [];
    this.spokenMessageIds.clear();
    this.spokenEventIds.clear();
    this.isSpeaking = false;
    this.currentRoomId = null;
    this.currentRoomCode = null;
    this.notify();
  }
}

export const ttsService = new TTSService();
