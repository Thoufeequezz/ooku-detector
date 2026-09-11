import React from 'react';

export function ChatMessage({
  message,
  isCurrentUser = false,
  isOokuTarget = false
}) {
  const timeStr = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex flex-col mb-4 animate-message-pop ${isCurrentUser ? 'items-end' : 'items-start'}`}>
      {/* Sender Name */}
      <span className="text-xs sm:text-sm font-mono font-bold text-purple-300 mb-1 px-1 tracking-wide">
        {isCurrentUser ? 'You' : message.sender_name}
      </span>

      {/* Message Bubble */}
      <div 
        className={`max-w-[90%] sm:max-w-lg px-5 py-3.5 rounded-2xl text-base sm:text-lg leading-relaxed shadow-xl border transition-all ${
          isOokuTarget
            ? 'bg-gradient-to-r from-[#FF3B5C]/20 via-[#8B5CF6]/30 to-[#11111F] border-[#FF3B5C]/60 text-white rounded-br-none animate-ooku-message-impact shadow-rose-500/20 ring-2 ring-rose-500/30'
            : isCurrentUser
            ? 'bg-gradient-to-r from-[#8B5CF6]/80 to-[#EC4899]/80 border-purple-400/40 text-white rounded-br-none shadow-purple-900/30'
            : 'bg-[#11111F] border-purple-500/20 text-slate-100 rounded-bl-none shadow-black/50 hover:border-purple-500/40'
        }`}
      >
        <p className="break-words font-sans selection:bg-rose-500 selection:text-white">
          {message.message}
        </p>
        
        <span className="block text-[10px] sm:text-[11px] font-mono text-purple-300/70 text-right mt-1.5 opacity-80">
          {timeStr}
        </span>
      </div>
    </div>
  );
}
