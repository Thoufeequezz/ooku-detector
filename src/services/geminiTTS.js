/**
 * FRIENDSHIP OS - Google Gemini Text-to-Speech (TTS) Service
 * Uses Google GenAI SDK (@google/genai), Supabase Edge Function proxy, or REST API.
 * Handles 24kHz 16-bit PCM audio decoding using Web Audio API (AudioContext) with browser fallback.
 */

import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const EDGE_FUNCTION_URL = import.meta.env.VITE_GEMINI_EDGE_FUNCTION_URL || '';

let ai = null;
if (GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (e) {
    console.warn('[GeminiTTS] SDK init warning:', e);
  }
}

const SYSTEM_VOICE_INSTRUCTION = `CRITICAL INSTRUCTION: You are a Text-To-Speech engine for Manglish (Malayalam written in English script). Read ONLY the exact user text provided below. Speak it naturally in casual Malayalam pronunciation. DO NOT add any greeting, intro, sender name, reaction, commentary, or extra words before or after the text. Read ONLY the input text word-for-word.`;

let audioCtx = null;
let currentSourceNode = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Base64 string to Uint8Array
 */
function base64ToUint8Array(base64) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts 16-bit PCM Little Endian byte array into Float32Array normalized between [-1.0, 1.0]
 */
function pcm16ToFloat32(bytes) {
  const sampleCount = Math.floor(bytes.length / 2);
  const floats = new Float32Array(sampleCount);
  const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  for (let i = 0; i < sampleCount; i++) {
    const int16 = dataView.getInt16(i * 2, true); // little-endian
    floats[i] = int16 < 0 ? int16 / 32768 : int16 / 32767;
  }
  return floats;
}

/**
 * Play raw PCM audio data buffer via Web Audio API at 24000Hz
 */
export function playPcmAudio(base64AudioData, sampleRate = 24000, onEnded = null, onError = null) {
  try {
    const ctx = getAudioContext();
    if (!ctx) {
      if (onError) onError(new Error('Web Audio API not supported'));
      return;
    }

    const bytes = base64ToUint8Array(base64AudioData);
    const float32Samples = pcm16ToFloat32(bytes);

    if (float32Samples.length === 0) {
      if (onEnded) onEnded();
      return;
    }

    const buffer = ctx.createBuffer(1, float32Samples.length, sampleRate);
    buffer.getChannelData(0).set(float32Samples);

    stopSpeech(); // Stop any currently playing node

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    currentSourceNode = source;

    source.onended = () => {
      if (currentSourceNode === source) {
        currentSourceNode = null;
      }
      if (onEnded) onEnded();
    };

    source.start(0);
  } catch (err) {
    console.warn('[GeminiTTS] PCM audio playback error:', err);
    if (onError) onError(err);
    else if (onEnded) onEnded();
  }
}

/**
 * Generate speech audio using Edge Function, Gemini SDK, or REST API
 */
export async function generateGeminiSpeech(text) {
  const promptText = `${SYSTEM_VOICE_INSTRUCTION}\n\nRead ONLY this exact text word-for-word without adding any extra words:\n"${text}"`;

  // 1. Try Supabase Edge Function endpoint first if configured
  if (EDGE_FUNCTION_URL) {
    try {
      const edgeRes = await fetch(EDGE_FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tts', text })
      });
      if (edgeRes.ok) {
        const edgeData = await edgeRes.json();
        if (edgeData && edgeData.audioData) {
          return {
            audioData: edgeData.audioData,
            mimeType: edgeData.mimeType || 'audio/pcm;rate=24000',
            sampleRate: edgeData.sampleRate || 24000
          };
        }
      }
    } catch (edgeErr) {
      console.warn('[GeminiTTS] Edge Function proxy error, falling back to direct API:', edgeErr);
    }
  }

  const apiKey = GEMINI_API_KEY || (typeof window !== 'undefined' ? window.GEMINI_API_KEY : '');
  if (!apiKey) {
    throw new Error('Gemini API key is not configured');
  }

  // 2. Try @google/genai SDK
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: promptText,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck'
              }
            }
          }
        }
      });

      const candidates = response?.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return {
              audioData: part.inlineData.data,
              mimeType: part.inlineData.mimeType || 'audio/pcm;rate=24000',
              sampleRate: 24000
            };
          }
        }
      }
    } catch (sdkErr) {
      console.warn('[GeminiTTS] SDK call error, trying REST endpoint:', sdkErr);
    }
  }

  // 3. REST API Fallback
  const restUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const response = await fetch(restUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Puck'
            }
          }
        }
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API HTTP error ${response.status}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return {
          audioData: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'audio/pcm;rate=24000',
          sampleRate: 24000
        };
      }
    }
  }

  throw new Error('No audio data returned from Gemini API');
}

/**
 * Browser speechSynthesis fallback
 */
export function playFallbackSpeech(text, onEnded = null) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnded) onEnded();
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices() || [];
    const inVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Rishi') || v.name.includes('Veena'));
    if (inVoice) {
      utterance.voice = inVoice;
    }

    utterance.onend = () => {
      if (onEnded) onEnded();
    };
    utterance.onerror = () => {
      if (onEnded) onEnded();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('[GeminiTTS] Browser fallback error:', e);
    if (onEnded) onEnded();
  }
}

/**
 * Main function: generate speech with Gemini TTS, play it, or fallback smoothly
 */
export async function playSpeech(text, onEnded = null, onError = null) {
  try {
    const result = await generateGeminiSpeech(text);
    if (result && result.audioData) {
      playPcmAudio(result.audioData, result.sampleRate || 24000, onEnded, onError);
      return;
    }
  } catch (err) {
    console.warn('[GeminiTTS] Gemini TTS failed, using browser fallback:', err.message || err);
  }

  // Smooth fallback if Gemini API is unconfigured or encounters quota issues
  playFallbackSpeech(text, onEnded);
}

export function stopSpeech() {
  if (currentSourceNode) {
    try {
      currentSourceNode.stop();
    } catch (e) {
      // ignore
    }
    currentSourceNode = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}
