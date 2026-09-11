import React, { useEffect, useState } from 'react';

const EMOJI_SET = ['💀', '😂', '🔥', '😭', '💥', '🤡', '👀'];

export function FloatingEmojis({ triggerKey }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!triggerKey) return;

    // Generate 8-12 floating emoji objects with randomized positions
    const newItems = Array.from({ length: 10 }).map((_, i) => ({
      id: `${triggerKey}_${i}_${Math.random()}`,
      emoji: EMOJI_SET[Math.floor(Math.random() * EMOJI_SET.length)],
      left: Math.floor(Math.random() * 85) + 5, // 5% to 90% horizontal position
      delay: Math.random() * 0.3, // 0s to 0.3s delay
      size: Math.floor(Math.random() * 16) + 24 // 24px to 40px
    }));

    setItems((prev) => [...prev, ...newItems]);

    // Cleanup items after animation completes (2.5s)
    const cleanup = setTimeout(() => {
      setItems((prev) => prev.filter((item) => !item.id.startsWith(triggerKey)));
    }, 2500);

    return () => clearTimeout(cleanup);
  }, [triggerKey]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {items.map((item) => (
        <span
          key={item.id}
          className="absolute bottom-12 animate-float-up opacity-0"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            fontSize: `${item.size}px`
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
