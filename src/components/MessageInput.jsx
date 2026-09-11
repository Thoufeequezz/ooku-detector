import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

const PLACEHOLDERS = [
  "Say something questionable...",
  "Start the damage...",
  "Your move 👀",
  "Go on. We are watching.",
  "Type something your friends will regret...",
  "Choose violence..."
];

const TYPING_MESSAGES = [
  "is cooking... 👀",
  "is loading a comeback...",
  "is choosing violence...",
  "is typing something they'll regret...",
  "has entered attack mode...",
  "is thinking... dangerous."
];

export function MessageInput({ onSendMessage, disabled = false, userName = "Someone" }) {
  const [text, setText] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [typingStatus, setTypingStatus] = useState(null);

  // Rotate funny placeholders occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Show typing status indicator when typing
  const handleInputChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (val.trim() && !typingStatus) {
      const randomMsg = TYPING_MESSAGES[Math.floor(Math.random() * TYPING_MESSAGES.length)];
      setTypingStatus(`${userName} ${randomMsg}`);
    } else if (!val.trim() && typingStatus) {
      setTypingStatus(null);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setText('');
    setTypingStatus(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-30 cyber-glass border-t border-purple-500/20 p-3 sm:p-4 backdrop-blur-2xl safe-area-bottom">
      <div className="max-w-3xl mx-auto space-y-2">
        {/* Dynamic Typing Indicator with Animated Dots */}
        {typingStatus && (
          <div className="px-2 text-xs font-mono text-cyan-300 flex items-center gap-2 animate-fadeIn">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-75" />
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-150" />
            </div>
            <span>{typingStatus}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            className="flex-1 h-[58px] sm:h-[64px] px-5 rounded-2xl bg-[#11111F] border-2 border-purple-500/30 focus:border-purple-500 focus:outline-none text-base sm:text-lg text-white placeholder-slate-500 font-sans shadow-inner transition-all"
          />

          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="h-[58px] w-[58px] sm:h-[64px] sm:w-[64px] rounded-2xl gradient-purple-pink hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xl flex items-center justify-center transition-all shadow-lg shadow-purple-600/30 active:scale-95 cursor-pointer shrink-0 border border-white/20"
            title="Send message"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
