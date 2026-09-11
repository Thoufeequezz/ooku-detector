import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedSquad } from '../utils/squadStorage';
import { classifyOoku } from '../services/aiService';
import { createSpeechService } from '../services/speechService';

export function useLiveSession() {
  const navigate = useNavigate();
  const squad = getSavedSquad();

  const [isListening, setIsListening] = useState(true);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [aiEvents, setAiEvents] = useState([]);
  
  // Ooku Metrics & Streak Tracking
  const [ookuCount, setOokuCount] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);

  // Async States & Deduplication Cache
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState(null);
  const processedIdsRef = useRef(new Set());
  const speechServiceRef = useRef(null);

  // Session Timer Effect
  useEffect(() => {
    let timer = null;
    if (isListening) {
      timer = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening]);

  // Core Pipeline to Process a Completed Speech Segment
  const processTranscriptSegment = useCallback(async (text, speakerName) => {
    if (!text || text.trim().length < 3) return;

    const trimmedText = text.trim();
    // Unique ID based on text content and timestamp to prevent duplicate analysis
    const dedupeKey = `${speakerName}:${trimmedText.toLowerCase()}`;

    if (processedIdsRef.current.has(dedupeKey)) {
      console.log("[useLiveSession] Skipping duplicate transcript:", dedupeKey);
      return;
    }

    // Mark as processed immediately
    processedIdsRef.current.add(dedupeKey);

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    // 1. Add to Transcript Feed immediately for UI responsiveness
    const newTranscript = {
      id: Date.now() + Math.random(),
      speaker: speakerName,
      text: trimmedText,
      timestamp
    };

    setTranscripts((prev) => [newTranscript, ...prev]);

    // 2. Non-blocking AI Classification
    setIsAnalyzing(true);
    setAiError(null);

    try {
      const result = await classifyOoku(trimmedText);

      // 3. Process AI Result & Update Metrics
      if (result.isOoku) {
        setOokuCount((prev) => prev + 1);
        setCurrentStreak((prev) => {
          const next = prev + 1;
          setMaxStreak((max) => Math.max(max, next));
          return next;
        });

        const newEvent = {
          id: Date.now() + Math.random(),
          speaker: speakerName,
          text: trimmedText,
          roastType: result.type,
          intensity: result.intensity * 10, // Convert 1-10 to percentage
          confidence: result.confidence,
          reaction: result.reaction,
          timestamp
        };

        // 4. Display detected event immediately
        setAiEvents((prev) => [newEvent, ...prev]);
      } else {
        // Reset streak on non-roast dialogue segment
        setCurrentStreak(0);
      }
    } catch (err) {
      console.error("[useLiveSession] Error analyzing segment:", err);
      setAiError("Failed to analyze speech segment.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [squad]);

  // Initialize Speech Recognition Service
  useEffect(() => {
    const handleFinalSpeech = (spokenText) => {
      const randomSpeaker = squad[Math.floor(Math.random() * squad.length)] || "Speaker";
      processTranscriptSegment(spokenText, randomSpeaker);
    };

    const handleSpeechError = (err) => {
      console.warn("[useLiveSession] Speech recognition error:", err);
    };

    const service = createSpeechService({
      onFinalTranscript: handleFinalSpeech,
      onError: handleSpeechError
    });

    speechServiceRef.current = service;

    if (isListening && service.isSupported) {
      service.start();
    }

    return () => {
      if (service.isSupported) service.stop();
    };
  }, [isListening, squad, processTranscriptSegment]);

  const togglePause = () => {
    setIsListening((prev) => {
      const nextState = !prev;
      if (speechServiceRef.current && speechServiceRef.current.isSupported) {
        if (nextState) speechServiceRef.current.start();
        else speechServiceRef.current.stop();
      }
      return nextState;
    });
  };

  const endSession = () => {
    setIsListening(false);
    if (speechServiceRef.current && speechServiceRef.current.isSupported) {
      speechServiceRef.current.stop();
    }
    navigate('/session');
  };

  const formatTimer = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}` : `${pad(mins)}:${pad(secs)}`;
  };

  // Manual Trigger helper for demonstration testing
  const addMockTranscript = () => {
    const randomSpeaker = squad[Math.floor(Math.random() * squad.length)] || "Friend";
    const sampleTexts = [
      "Enikku BMW vaangaanulla cash undu bro...",
      "Njan innu 5 hrs workout cheythu!",
      "Njan code ezhuthiyaal bugs onnum undavilla.",
      "Guys, tea break eduthaalo?"
    ];
    const text = sampleTexts[transcripts.length % sampleTexts.length];
    processTranscriptSegment(text, randomSpeaker);
  };

  const addMockAiEvent = () => {
    const randomSpeaker = squad[Math.floor(Math.random() * squad.length)] || "Friend";
    const sampleText = "Enikku BMW vaangaanulla cash undu bro...";
    processTranscriptSegment(sampleText, randomSpeaker);
  };

  return {
    squad,
    isListening,
    isAnalyzing,
    aiError,
    ookuCount,
    currentStreak,
    maxStreak,
    togglePause,
    endSession,
    timerFormatted: formatTimer(secondsElapsed),
    transcripts,
    aiEvents,
    addMockTranscript,
    addMockAiEvent
  };
}
