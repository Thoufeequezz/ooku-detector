/**
 * Friendship OS - Web Speech Recognition Service
 * Wraps Web Speech API (webkitSpeechRecognition / SpeechRecognition)
 * Emits finalized completed speech segments for AI classification.
 */

export function createSpeechService({ onFinalTranscript, onError, onStatusChange }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("[SpeechService] Web Speech API not supported in this browser. Falling back to manual mode.");
    return {
      isSupported: false,
      start: () => {},
      stop: () => {}
    };
  }

  let recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Captures English and Manglish phonetics

  let isListening = false;

  recognition.onstart = () => {
    isListening = true;
    if (onStatusChange) onStatusChange(true);
  };

  recognition.onend = () => {
    // Auto restart if intended to be listening continuously
    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        console.warn("[SpeechService] Restart error:", e);
      }
    } else {
      if (onStatusChange) onStatusChange(false);
    }
  };

  recognition.onerror = (event) => {
    console.error("[SpeechService] Recognition error:", event.error);
    if (onError) onError(event.error);
  };

  recognition.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const text = event.results[i][0].transcript.trim();
        if (text.length > 2) {
          onFinalTranscript(text);
        }
      }
    }
  };

  return {
    isSupported: true,
    start: () => {
      isListening = true;
      try {
        recognition.start();
      } catch (e) {
        console.warn("[SpeechService] Start error:", e);
      }
    },
    stop: () => {
      isListening = false;
      try {
        recognition.stop();
      } catch (e) {
        console.warn("[SpeechService] Stop error:", e);
      }
    }
  };
}
