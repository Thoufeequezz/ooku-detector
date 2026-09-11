import React, { useMemo } from 'react';

const FLOATING_ITEMS = ['💀', '😂', '🔥', '🤡', '👀', '💥', '😭'];

export function BackgroundFloatingEmojis() {
  const elements = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: `bg_float_${i}`,
      emoji: FLOATING_ITEMS[i % FLOATING_ITEMS.length],
      left: Math.floor((i * 12) + 4),
      top: Math.floor(Math.random() * 80) + 10,
      size: Math.floor(Math.random() * 16) + 24,
      delay: Math.random() * 3
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-25">
      {elements.map((item) => (
        <span
          key={item.id}
          className="absolute animate-float-slow select-none"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}px`,
            animationDelay: `${item.delay}s`
          }}
        >
          {item.emoji}
        </span>
      ))}
    </div>
  );
}
