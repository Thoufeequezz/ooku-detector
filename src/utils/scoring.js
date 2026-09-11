/**
 * FRIENDSHIP OS - Award Ceremony Scoring Utility
 * Fictional comedy statistics and hilarious diagnosis calculator.
 */

export function calculateOokuReport(ookuEvents = [], roomMembers = []) {
  let totalOoku = 0;
  let totalDamage = 0;
  let maxCombo = 0;
  let biggestHit = 0;

  const speakerScores = {};
  const targetRoastCounts = {};

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

    const intensity = Number(event.intensity) || 7;
    const damage = intensity * 10;
    totalDamage += damage;
    if (damage > biggestHit) biggestHit = damage;

    let points = 10;
    if (event.type === 'COUNTER_OOKU') points = 15;
    if (event.type === 'CRITICAL_OOKU') points = 25;

    const speaker = event.speaker || event.sender_name;
    const target = event.target || event.target_name;

    if (speaker) {
      speakerScores[speaker] = (speakerScores[speaker] || 0) + points;
    }
    if (target) {
      targetRoastCounts[target] = (targetRoastCounts[target] || 0) + 1;
    }
  });

  // Determine Ooku King
  let ookuKing = "Adil";
  let maxScore = -1;
  Object.entries(speakerScores).forEach(([name, score]) => {
    if (score > maxScore) {
      maxScore = score;
      ookuKing = name;
    }
  });

  // Determine Most Roasted
  let mostRoasted = "Thoufeek";
  let maxRoasts = -1;
  Object.entries(targetRoastCounts).forEach(([name, count]) => {
    if (count > maxRoasts) {
      maxRoasts = count;
      mostRoasted = name;
    }
  });

  // Select Comedic Diagnosis
  const diagnoses = [
    {
      title: "SEVERE MUTUAL OOKU SYNDROME 🩺",
      subtitle: "You insult each other constantly, counter-attack immediately, and somehow still call each other friends."
    },
    {
      title: "FRIENDSHIP HELD TOGETHER BY INSULTS 🩹",
      subtitle: "The friendship is questionable. The Ooku statistics are impressive."
    },
    {
      title: "PROFESSIONAL ROASTING RELATIONSHIP 💼",
      subtitle: "At this point, this isn't a conversation. It's competitive roasting."
    },
    {
      title: "CHRONIC COUNTER-OOKU DISORDER 🔥",
      subtitle: "Zero hesitation detected. Every single statement is met with immediate hostile banter."
    },
    {
      title: "TERMINAL GROUP CHAT CHAOS 💀",
      subtitle: "The AI referee recommends immediate group therapy or at least a tea break."
    }
  ];

  const selectedDiagnosis = diagnoses[totalOoku % diagnoses.length];

  return {
    totalOoku: totalOoku > 0 ? totalOoku : 27,
    totalDamage: totalDamage > 0 ? totalDamage : 284,
    ookuKing,
    mostRoasted,
    biggestHit: biggestHit > 0 ? biggestHit : 87,
    longestCombo: maxCombo > 0 ? maxCombo : 7,
    diagnosis: selectedDiagnosis
  };
}
