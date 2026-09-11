/**
 * FRIENDSHIP OS / OOKU DETECTOR - Ooku Combo Detector
 * Detects back-and-forth roasting sequences and combo multipliers.
 */

export function detectCombo(ookuEvents = []) {
  if (!ookuEvents || ookuEvents.length === 0) return { comboCount: 0, comboText: "" };

  const NOW = Date.now();
  let streak = 0;

  // Sort descending by created_at (newest first)
  const sortedDesc = [...ookuEvents].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));

  for (let i = 0; i < sortedDesc.length; i++) {
    const eventTime = new Date(sortedDesc[i].created_at || Date.now()).getTime();
    // Count roasts within last 90 seconds
    if (NOW - eventTime < 90000 && sortedDesc[i].isOoku) {
      streak += 1;
    } else {
      break;
    }
  }

  if (streak >= 5) {
    return {
      comboCount: streak,
      comboText: "💀 FRIENDSHIP COMBAT ACTIVATED"
    };
  }

  if (streak >= 2) {
    return {
      comboCount: streak,
      comboText: `🔥🔥 OOKU COMBO ×${streak}`
    };
  }

  return { comboCount: 0, comboText: "" };
}

