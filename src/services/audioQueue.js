/**
 * FRIENDSHIP OS - Audio Queue & Speech Manager
 * Manages FIFO sequential audio playback for Gemini TTS and prevents audio overlaps,
 * handles deduplication (spokenMessageIds / spokenEventIds), room filtering,
 * long message truncation, and local audio mute state.
 */

import { playSpeech, stopSpeech } from './geminiTTS';
import { ookuAudio } from './ookuAudio';

class AudioQueueManager {
  constructor() {
    this.spokenMessageIds = new Set();
    this.spokenEventIds = new Set();
    this.queue = [];
    this.isPlaying = false;
    this.isEnabled = false;
    this.isMuted = false;
    this.currentRoomId = null;
    this.currentRoomCode = null;
    this.listeners = new Set();
  }

  isSupported() {
    return typeof window !== 'undefined';
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
      isMuted: this.isMuted,
      isPlaying: this.isPlaying,
      queueLength: this.queue.length
    };
  }

  initRoom(roomId, roomCode, existingMessages = []) {
    this.currentRoomId = roomId;
    this.currentRoomCode = roomCode ? roomCode.trim().toUpperCase() : null;
    this.seedExistingMessageIds(existingMessages);
    ookuAudio.preloadOokuAudio();
  }

  seedExistingMessageIds(messages = []) {
    messages.forEach((msg) => {
      if (msg && msg.id) {
        this.spokenMessageIds.add(msg.id);
      }
    });
  }

  enableAudio() {
    this.isEnabled = true;
    this.isMuted = false;

    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const dummyCtx = new AudioCtx();
        dummyCtx.resume().then(() => dummyCtx.close()).catch(() => {});
      }
    }

    this.notify();
    this.processQueue();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
      this.queue = [];
      this.isPlaying = false;
    }
    this.notify();
    if (!this.isMuted) {
      this.processQueue();
    }
  }

  setMuted(muted) {
    this.isMuted = Boolean(muted);
    if (this.isMuted) {
      this.stopSpeech();
      this.queue = [];
      this.isPlaying = false;
    }
    this.notify();
    if (!this.isMuted) {
      this.processQueue();
    }
  }

  /**
   * Main entry point to queue a user message for speech
   */
  queueSpeech(msg, targetRoomId = null, targetRoomCode = null) {
    if (!msg || !msg.id) return;
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

    const rawText = msg.message || msg.text || '';

    // 3. Long Message Protection (> 300 chars)
    let spokenText = rawText.trim();
    if (spokenText.length > 300) {
      spokenText = spokenText.substring(0, 250) + '... Message valare long aanu... chat-il full message kaanam.';
    }

    // 4. Gemini TTS reads ONLY the exact original message text (NO intro prefix)
    const fullSpeechText = spokenText;

    // Add to FIFO audio queue
    this.queue.push({
      id: msg.id,
      text: fullSpeechText,
      isOoku: false
    });

    this.notify();
    this.processQueue();
  }

  /**
   * Queue real Ooku audio clip after an Ooku event is detected
   */
  queueOokuReaction(event, targetRoomId = null, targetRoomCode = null) {
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

    // Queue ONLY the external Ooku audio sound clip item
    this.queue.push({
      id: `${eventKey}_sfx`,
      isOokuSfx: true,
      intensity: event.intensity || 5,
      type: event.type || 'OOKU',
      eventId: eventKey
    });

    this.notify();
    this.processQueue();
  }

  processQueue() {
    if (!this.isEnabled || this.isMuted) return;
    if (this.isPlaying) return;
    if (this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item) return;

    this.isPlaying = true;
    this.notify();

    const onFinish = () => {
      this.isPlaying = false;
      this.notify();
      setTimeout(() => {
        this.processQueue();
      }, 150);
    };

    if (item.isOokuSfx) {
      ookuAudio.playOokuAudio(item.intensity, item.type, item.eventId).then(onFinish);
    } else {
      playSpeech(item.text, onFinish, onFinish);
    }
  }

  stopSpeech() {
    stopSpeech();
    ookuAudio.stopOokuAudio();
    this.isPlaying = false;
    this.notify();
  }

  clearSpeechQueue() {
    stopSpeech();
    ookuAudio.clear();
    this.queue = [];
    this.spokenMessageIds.clear();
    this.spokenEventIds.clear();
    this.isPlaying = false;
    this.currentRoomId = null;
    this.currentRoomCode = null;
    this.notify();
  }
}

export const audioQueue = new AudioQueueManager();
