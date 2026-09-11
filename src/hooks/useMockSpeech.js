import { useState, useEffect } from 'react';
import { MOCK_OOKU_PHRASES } from '../data/mockOokuData';

export function useMockSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feed, setFeed] = useState([MOCK_OOKU_PHRASES[0]]);
  const [activePhrase, setActivePhrase] = useState(MOCK_OOKU_PHRASES[0]);

  const toggleListening = () => {
    setIsListening((prev) => !prev);
  };

  const triggerNextRoast = () => {
    const nextIdx = (currentIndex + 1) % MOCK_OOKU_PHRASES.length;
    setCurrentIndex(nextIdx);
    const nextItem = MOCK_OOKU_PHRASES[nextIdx];
    setActivePhrase(nextItem);
    setFeed((prev) => [nextItem, ...prev]);
  };

  useEffect(() => {
    let interval = null;
    if (isListening) {
      interval = setInterval(() => {
        triggerNextRoast();
      }, 4000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, currentIndex]);

  return {
    isListening,
    toggleListening,
    feed,
    activePhrase,
    triggerNextRoast
  };
}
