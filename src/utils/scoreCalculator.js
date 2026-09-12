/**
 * FRIENDSHIP OS - Centralized Score & Rank Calculator
 * Calculates player stats, ranks, awards, and friendship diagnosis from real room events.
 */

export function calculatePlayerStats(messages = [], ookuEvents = [], members = []) {
  const statsMap = new Map();

  // Initialize all members
  members.forEach((m) => {
    const pId = typeof m === 'string' ? m : (m.participant_id || m.id || m.name);
    const pName = typeof m === 'string' ? m : (m.name || m.participant_id || 'Unknown');
    const isActive = typeof m === 'object' && m.is_active !== undefined ? m.is_active : true;
    const exitedAt = typeof m === 'object' ? m.exited_at : null;

    statsMap.set(pName, {
      participant_id: pId,
      name: pName,
      is_active: isActive,
      exited_at: exitedAt,
      damage: 0,
      ookuCount: 0,
      counterCount: 0,
      bestCombo: 1,
      currentCombo: 1,
      highestHit: 0,
      timesTargeted: 0,
      messagesSent: 0
    });
  });

  // Count messages per member
  messages.forEach((msg) => {
    if (!msg || msg.isSystem) return;
    const sender = msg.sender_name || 'Unknown';
    if (!statsMap.has(sender)) {
      statsMap.set(sender, {
        participant_id: msg.participant_id || sender,
        name: sender,
        is_active: true,
        exited_at: null,
        damage: 0,
        ookuCount: 0,
        counterCount: 0,
        bestCombo: 1,
        currentCombo: 1,
        highestHit: 0,
        timesTargeted: 0,
        messagesSent: 0
      });
    }
    const stat = statsMap.get(sender);
    stat.messagesSent += 1;
  });

  // Calculate damage and combos chronologically from Ooku events
  const sortedEvents = [...ookuEvents].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

  let lastSpeaker = null;

  sortedEvents.forEach((evt) => {
    if (!evt) return;

    const speaker = evt.speaker || evt.sender_name || 'Unknown';
    const target = evt.target || evt.target_name || null;
    const damage = evt.damage || (Number(evt.intensity) || 5) * 10;
    const intensity = Number(evt.intensity) || 5;
    const isCounter = evt.type === 'COUNTER_OOKU';

    if (!statsMap.has(speaker)) {
      statsMap.set(speaker, {
        participant_id: evt.participant_id || speaker,
        name: speaker,
        is_active: true,
        exited_at: null,
        damage: 0,
        ookuCount: 0,
        counterCount: 0,
        bestCombo: 1,
        currentCombo: 1,
        highestHit: 0,
        timesTargeted: 0,
        messagesSent: 0
      });
    }

    const stat = statsMap.get(speaker);
    stat.damage += damage;
    stat.ookuCount += 1;
    if (isCounter) stat.counterCount += 1;
    if (intensity > stat.highestHit) stat.highestHit = intensity;

    // Combo logic
    if (lastSpeaker === speaker) {
      stat.currentCombo += 1;
      if (stat.currentCombo > stat.bestCombo) {
        stat.bestCombo = stat.currentCombo;
      }
    } else {
      stat.currentCombo = 1;
      lastSpeaker = speaker;
    }

    // Target tracking
    if (target && statsMap.has(target)) {
      statsMap.get(target).timesTargeted += 1;
    }
  });

  // Sort players by: 1. Damage DESC, 2. Ooku Count DESC, 3. Highest Hit DESC, 4. Name ASC
  const sortedStats = Array.from(statsMap.values()).sort((a, b) => {
    if (b.damage !== a.damage) return b.damage - a.damage;
    if (b.ookuCount !== a.ookuCount) return b.ookuCount - a.ookuCount;
    if (b.highestHit !== a.highestHit) return b.highestHit - a.highestHit;
    return a.name.localeCompare(b.name);
  });

  // Assign Ranks (#1, #2, #3, ...)
  const rankedStats = sortedStats.map((stat, idx) => ({
    ...stat,
    rank: idx + 1
  }));

  const activePlayers = rankedStats.filter((p) => p.is_active);
  const exitedPlayers = rankedStats.filter((p) => !p.is_active);

  return {
    allPlayers: rankedStats,
    activePlayers,
    exitedPlayers,
    totalDamage: rankedStats.reduce((acc, p) => acc + p.damage, 0),
    totalOokuCount: sortedEvents.length,
    totalMessages: messages.filter(m => !m?.isSystem).length
  };
}

/**
 * Calculate dynamic comedy awards from room stats
 */
export function calculateAwards(rankedStats = [], ookuEvents = []) {
  if (!rankedStats || rankedStats.length === 0) return [];

  const awards = [];

  // 1. Ooku King (Highest Total Damage)
  const ookuKing = [...rankedStats].sort((a, b) => b.damage - a.damage)[0];
  if (ookuKing && ookuKing.damage > 0) {
    awards.push({
      title: '👑 OOKU KING',
      subtitle: 'Highest total damage dealt',
      winner: ookuKing.name,
      stat: `🔥 ${ookuKing.damage} DMG`,
      color: 'from-amber-500 to-yellow-300'
    });
  }

  // 2. Most Roasted (Most times targeted)
  const mostTargeted = [...rankedStats].sort((a, b) => b.timesTargeted - a.timesTargeted)[0];
  if (mostTargeted && mostTargeted.timesTargeted > 0) {
    awards.push({
      title: '💀 MOST ROASTED',
      subtitle: 'Survived the most target attacks',
      winner: mostTargeted.name,
      stat: `🎯 Targeted ${mostTargeted.timesTargeted}x`,
      color: 'from-rose-500 to-red-400'
    });
  }

  // 3. Biggest Hit (Highest single intensity)
  const biggestHitPlayer = [...rankedStats].sort((a, b) => b.highestHit - a.highestHit)[0];
  if (biggestHitPlayer && biggestHitPlayer.highestHit > 0) {
    awards.push({
      title: '🔥 BIGGEST HIT',
      subtitle: 'Landed the highest intensity roast',
      winner: biggestHitPlayer.name,
      stat: `💥 Level ${biggestHitPlayer.highestHit} Roast`,
      color: 'from-purple-500 to-pink-500'
    });
  }

  // 4. Combo Master (Highest combo)
  const comboMaster = [...rankedStats].sort((a, b) => b.bestCombo - a.bestCombo)[0];
  if (comboMaster && comboMaster.bestCombo > 1) {
    awards.push({
      title: '⚡ COMBO MASTER',
      subtitle: 'Longest unbroken roast streak',
      winner: comboMaster.name,
      stat: `🔥 x${comboMaster.bestCombo} Combo`,
      color: 'from-cyan-400 to-blue-500'
    });
  }

  // 5. Comeback King (Most counter-ooku events)
  const comebackKing = [...rankedStats].sort((a, b) => b.counterCount - a.counterCount)[0];
  if (comebackKing && comebackKing.counterCount > 0) {
    awards.push({
      title: '😂 COMEBACK KING',
      subtitle: 'Most counter roasts executed',
      winner: comebackKing.name,
      stat: `🛡️ ${comebackKing.counterCount} Counters`,
      color: 'from-emerald-400 to-teal-500'
    });
  }

  return awards;
}

/**
 * Generate dynamic Friendship Diagnosis
 */
export function generateFriendshipDiagnosis(totalMessages = 0, totalOoku = 0, totalDamage = 0) {
  let status = '💀 SEVERE OOKU SYNDROME';
  let severity = 'CRITICAL';
  let quote = 'Your friendship survived, but your dignity was completely destroyed. 😂';

  if (totalOoku === 0) {
    status = '😇 SUSPICIOUS PEACE';
    severity = 'MILD';
    quote = 'Too nice... Are you guys actually real friends? 🧐';
  } else if (totalOoku < 5) {
    status = '🌶️ LIGHT FRICTION';
    severity = 'MODERATE';
    quote = 'Minor roasting detected. Normal college friendship levels.';
  } else if (totalOoku >= 12) {
    status = '☢️ TOTAL FRIENDSHIP TOXICITY';
    severity = 'MAXIMUM';
    quote = 'HR has been notified. Group chat recommended for mandatory anger therapy. 💀';
  }

  return {
    status,
    severity,
    quote,
    totalMessages,
    totalOoku,
    totalDamage,
    disclaimer: '100% fictional diagnosis. We are not doctors. 😂'
  };
}
