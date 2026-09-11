/**
 * FRIENDSHIP OS - Ooku Audio Service
 * Manages playing real comedy Ooku audio clips from public/sounds/ooku/ based on intensity & type.
 * Includes category mapping, anti-consecutive randomization, 60% volume, deduplication, and fallback.
 */

import { playOokuSoundEffect } from './soundEffectService';

const AUDIO_BASE_PATH = '/sounds/ooku/';

const CATEGORY_MAP = {
  LIGHT: [
    'light-1.mp3', 'light-2.mp3', 'light-3.mp3',
    'light-1.wav', 'light-2.wav', 'light-3.wav',
    'light-1.ogg', 'light-2.ogg', 'light-3.ogg',
    'Solid Mentality Sound Effect.mp3'
  ],
  MEDIUM: [
    'medium-1.mp3', 'medium-2.mp3', 'medium-3.mp3',
    'medium-1.wav', 'medium-2.wav', 'medium-3.wav',
    'medium-1.ogg', 'medium-2.ogg', 'medium-3.ogg',
    'Solid Mentality Sound Effect.mp3'
  ],
  HEAVY: [
    'heavy-1.mp3', 'heavy-2.mp3', 'heavy-3.mp3',
    'heavy-1.wav', 'heavy-2.wav', 'heavy-3.wav',
    'heavy-1.ogg', 'heavy-2.ogg', 'heavy-3.ogg',
    'Solid Mentality Sound Effect.mp3'
  ],
  CRITICAL: [
    'critical-1.mp3', 'critical-2.mp3', 'critical-3.mp3',
    'critical-1.wav', 'critical-2.wav', 'critical-3.wav',
    'critical-1.ogg', 'critical-2.ogg', 'critical-3.ogg',
    'Solid Mentality Sound Effect.mp3'
  ],
  COUNTER: [
    'counter-1.mp3', 'counter-2.mp3', 'counter-3.mp3',
    'counter-1.wav', 'counter-2.wav', 'counter-3.wav',
    'counter-1.ogg', 'counter-2.ogg', 'counter-3.ogg',
    'Solid Mentality Sound Effect.mp3'
  ]
};

class OokuAudioService {
  constructor() {
    this.playedOokuEventIds = new Set();
    this.lastPlayedClip = null;
    this.currentAudio = null;
    this.preloadedAudio = new Map();
  }

  /**
   * Map intensity number and event type to category string
   */
  getCategory(intensity, type) {
    if (type === 'COUNTER_OOKU') return 'COUNTER';
    if (type === 'CRITICAL_OOKU') return 'CRITICAL';

    const intVal = Number(intensity) || 5;
    if (intVal >= 9) return 'CRITICAL';
    if (intVal >= 7) return 'HEAVY';
    if (intVal >= 4) return 'MEDIUM';
    return 'LIGHT';
  }

  /**
   * Preload short audio clips for smoother playback
   */
  preloadOokuAudio() {
    if (typeof window === 'undefined') return;

    Object.values(CATEGORY_MAP).flat().forEach((fileName) => {
      if (!this.preloadedAudio.has(fileName)) {
        const audio = new Audio();
        audio.src = `${AUDIO_BASE_PATH}${encodeURIComponent(fileName).replace(/%2F/g, '/')}`;
        audio.preload = 'auto';
        this.preloadedAudio.set(fileName, audio);
      }
    });
  }

  /**
   * Select a random clip from category ensuring no consecutive duplicates
   */
  selectClip(category) {
    const rawCandidates = CATEGORY_MAP[category] || CATEGORY_MAP.MEDIUM;
    // Always include custom user files like Solid Mentality Sound Effect.mp3 first
    const candidates = ['Solid Mentality Sound Effect.mp3', ...rawCandidates];
    let filtered = candidates.filter((clip) => clip !== this.lastPlayedClip);
    if (filtered.length === 0) filtered = candidates;

    const chosen = filtered[Math.floor(Math.random() * filtered.length)];
    this.lastPlayedClip = chosen;
    return chosen;
  }

  /**
   * Stop currently playing Ooku audio
   */
  stopOokuAudio() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch (e) {
        // ignore
      }
      this.currentAudio = null;
    }
  }

  /**
   * Main function: play Ooku audio clip returns a Promise when finished
   */
  playOokuAudio(intensity = 5, type = 'OOKU', eventId = null) {
    return new Promise((resolve) => {
      // 1. Deduplication check
      if (eventId) {
        if (this.playedOokuEventIds.has(eventId)) {
          resolve();
          return;
        }
        this.playedOokuEventIds.add(eventId);
      }

      if (typeof window === 'undefined') {
        resolve();
        return;
      }

      this.stopOokuAudio();

      const category = this.getCategory(intensity, type);
      const chosenClip = this.selectClip(category);
      const audioUrl = `${AUDIO_BASE_PATH}${encodeURIComponent(chosenClip)}`;

      const audio = new Audio(audioUrl);
      audio.volume = 0.65; // Set volume to 65%

      this.currentAudio = audio;

      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          this.currentAudio = null;
          resolve();
        }
      };

      audio.onended = finish;

      audio.onerror = () => {
        // Fallback gracefully to synthesized SFX if file does not exist or fails to load
        try {
          playOokuSoundEffect(intensity, type);
        } catch (e) {
          // ignore
        }
        setTimeout(finish, 400); // Allow fallback sound to finish
      };

      audio.play().catch((err) => {
        console.warn('[OokuAudio] File play attempt:', err.message || err);
        try {
          playOokuSoundEffect(intensity, type);
        } catch (e) {
          // ignore
        }
        setTimeout(finish, 400);
      });
    });
  }

  clear() {
    this.stopOokuAudio();
    this.playedOokuEventIds.clear();
    this.lastPlayedClip = null;
  }
}

export const ookuAudio = new OokuAudioService();
