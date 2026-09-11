/**
 * FRIENDSHIP OS - Comedic Scoring Utility
 * Purely fictional and humorous statistics calculator.
 */

export function calculateOokuStats(ookuEvents = [], roomMembers = []) {
  let totalOoku = 0;
  let totalDamage = 0;
  let maxCombo = 0;

  const speakerScores = {};
  const targetRoastCounts = {};

  // Initialize room members in score dicts
  roomMembers.forEach(m => {
    const name = typeof m === 'string' ? m : m.name;
    if (name) {
      speakerScores[name] = 0;
      targetRoastCounts[name] = 0;
    }
  });

  let currentCombo = 0;

  ookuEvents.forEach(event => {
    if (!event.isOoku && event.type === 'NORMAL') return;

    totalOoku += 1;
    currentCombo += 1;
    if (currentCombo > maxCombo) maxCombo = currentCombo;

    const intensity = Number(event.intensity) || 5;
    const damage = intensity * 10;
    totalDamage += damage;

    let points = 10;
    if (event.type === 'COUNTER_OOKU') points = 15;
    if (event.type === 'CRITICAL_OOKU') points = 25;

    const speaker = event.speaker;
    const target = event.target;

    if (speaker) {
      speakerScores[speaker] = (speakerScores[speaker] || 0) + points;
    }
    if (target) {
      targetRoastCounts[target] = (targetRoastCounts[target] || 0) + 1;
    }
  });

  // Find Ooku King (Highest scorer)
  let ookuKing = "None";
  let maxScore = -1;
  Object.entries(speakerScores).forEach(([name, score]) => {
    if (score > maxScore) {
      maxScore = score;
      ookuKing = name;
    }
  });

  // Find Most Roasted
  let mostRoasted = "None";
  let maxRoasts = -1;
  Object.entries(targetRoastCounts).forEach(([name, count]) => {
    if (count > maxRoasts) {
      maxRoasts = count;
      mostRoasted = name;
    }
  });

  // Fallback defaults if no events recorded yet
  if (totalOoku === 0 && roomMembers.length > 0) {
    ookuKing = typeof roomMembers[0] === 'string' ? roomMembers[0] : roomMembers[0].name;
    mostRoasted = roomMembers.length > 1 
      ? (typeof roomMembers[1] === 'string' ? roomMembers[1] : roomMembers[1].name) 
      : ookuKing;
  }

  return {
    totalOoku,
    totalDamage,
    ookuKing: ookuKing || "Adil",
    mostRoasted: mostRoasted || "Muhammad Thoufeeq",
    longestCombo: maxCombo > 0 ? maxCombo : 3,
    diagnosis: getComedicDiagnosis(totalOoku, totalDamage)
  };
}

function getComedicDiagnosis(totalOoku, totalDamage) {
  if (totalDamage > 200 || totalOoku > 15) {
    return {
      title: "SEVERE MUTUAL OOKU SYNDROME 💀",
      subtitle: "“You insult each other constantly and somehow you're still friends.”"
    };
  }
  if (totalOoku > 5) {
    return {
      title: "STAGE 2 FRIENDSHIP TEASING ALERT 🔥",
      subtitle: "“High levels of sarcastic banter detected. Bonding status: Extremely strong.”"
    };
  }
  return {
    title: "MILD BANTER SYNDROME ☕",
    subtitle: "“Suspiciously polite conversation. You need to roast each other more.”"
  };
}
