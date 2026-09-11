/**
 * FRIENDSHIP OS / OOKU DETECTOR - Dynamic Few-Shot AI Classifier Service
 * Analyzes chat messages in real-time in the background without blocking conversation.
 */

import { ookuDataset } from '../data/ookuDataset';
import { classifyOokuFallback } from '../utils/ookuFallback';

const SYSTEM_PROMPT = `
You are the Ooku referee for a Malayalam/Manglish/English friend group chat.
"Ooku" means playful teasing, roasting, sarcasm, or friendly verbal attacks between friends.

RULES:
1. Understand Malayalam written using English letters (Manglish).
2. Consider the recent conversation context (last 5-10 messages).
3. Friendly normal conversation (greetings, simple questions, normal chat) = "NORMAL".
4. Playful roast/teasing = "OOKU".
5. A response that directly attacks a previous roast = "COUNTER_OOKU".
6. Serious threats, hate speech, or genuinely harmful content should NOT be treated as funny Ooku.
7. Set "isOoku" to true ONLY if label is OOKU, COUNTER_OOKU, or CRITICAL_OOKU AND confidence >= 0.70.
8. "intensity": 0 for NORMAL, 1-3 for LIGHT, 4-6 for MEDIUM, 7-8 for HEAVY, 9-10 for CRITICAL.

Return ONLY valid JSON matching this exact structure:
{
  "label": "NORMAL" | "OOKU" | "COUNTER_OOKU" | "CRITICAL_OOKU",
  "isOoku": boolean,
  "intensity": number,
  "target": string | null,
  "confidence": number
}
`;

export function calculateOokuDamage(type, intensity) {
  let baseDamage = 10;
  const intVal = Number(intensity) || 5;

  if (intVal >= 9) baseDamage = 90;
  else if (intVal >= 7) baseDamage = 50;
  else if (intVal >= 4) baseDamage = 25;
  else baseDamage = 10;

  if (type === 'COUNTER_OOKU') {
    baseDamage += 15;
  }
  return baseDamage;
}

/**
 * Select a balanced sample of few-shot dataset examples to guide Gemini
 */
function getFewShotExamplesPrompt(messageText) {
  const normalExamples = ookuDataset.filter(ex => ex.label === 'NORMAL').slice(0, 4);
  const ookuExamples = ookuDataset.filter(ex => ex.label === 'OOKU').slice(0, 6);
  const counterExamples = ookuDataset.filter(ex => ex.label === 'COUNTER_OOKU').slice(0, 4);

  const selected = [...normalExamples, ...ookuExamples, ...counterExamples];

  return selected
    .map(ex => `Input: "${ex.text}" -> Output: {"label": "${ex.label}", "isOoku": ${ex.label !== 'NORMAL'}, "intensity": ${ex.intensity}, "target": null, "confidence": 0.95}`)
    .join("\n");
}

export async function analyzeChatMessage(messageText, recentContext = [], currentSender = "Friend", roomMembers = []) {
  if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
    return { label: "NORMAL", type: "NORMAL", isOoku: false, speaker: currentSender, target: null, intensity: 0, confidence: 0.95 };
  }

  // Infer target from context if needed
  let inferredTarget = null;
  const otherMembers = roomMembers.filter(m => m !== currentSender);
  if (otherMembers.length === 1) {
    inferredTarget = otherMembers[0];
  } else if (recentContext.length > 0) {
    const lastOther = [...recentContext].reverse().find(m => m.sender_name && m.sender_name !== currentSender && !m.isSystem);
    if (lastOther) inferredTarget = lastOther.sender_name;
  }

  const lower = messageText.toLowerCase().trim();

  // Instant Dataset Match check
  const exactDatasetItem = ookuDataset.find(
    item => item.text.toLowerCase().trim() === lower || lower.includes(item.text.toLowerCase().trim())
  );

  if (exactDatasetItem && exactDatasetItem.label !== 'NORMAL') {
    return {
      label: exactDatasetItem.label,
      type: exactDatasetItem.label,
      isOoku: true,
      speaker: currentSender,
      target: inferredTarget,
      intensity: exactDatasetItem.intensity || 7,
      confidence: 0.98
    };
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_AI_API_KEY;

  if (apiKey) {
    try {
      const historyStr = recentContext
        .filter(m => !m.isSystem)
        .slice(-7)
        .map(m => `${m.sender_name || 'Friend'}: "${m.message || m.text || ''}"`)
        .join("\n");

      const fewShotStr = getFewShotExamplesPrompt(messageText);

      const userPrompt = `
FEW-SHOT TRAINING EXAMPLES:
${fewShotStr}

ROOM PARTICIPANTS: ${roomMembers.length > 0 ? roomMembers.join(", ") : currentSender}

RECENT CONVERSATION CONTEXT (last 5-10 messages):
${historyStr || "(No previous messages)"}

NEW MESSAGE TO CLASSIFY FROM ${currentSender}:
"${messageText}"

Analyze this new message using the few-shot examples and context. Return ONLY JSON.
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n${userPrompt}` }] }],
            generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const confidence = Number(parsed.confidence) || 0.85;
          const label = parsed.label || parsed.type || "NORMAL";
          const isOoku = Boolean(parsed.isOoku) && label !== "NORMAL" && confidence >= 0.70;
          const intensity = Math.min(10, Math.max(1, Number(parsed.intensity) || 5));
          const target = parsed.target || (isOoku ? inferredTarget : null);

          return {
            label: isOoku ? label : "NORMAL",
            type: isOoku ? label : "NORMAL",
            isOoku,
            speaker: currentSender,
            target,
            intensity: isOoku ? intensity : 0,
            confidence
          };
        }
      }
    } catch (err) {
      console.warn("[AIService] Gemini API request failed, engaging local fallback classifier:", err);
    }
  }

  // Fallback Local Pattern Classifier if API unavailable or key missing
  const fallbackResult = classifyOokuFallback(messageText, recentContext, currentSender, inferredTarget);
  return {
    ...fallbackResult,
    type: fallbackResult.label
  };
}

export async function classifyOoku(text, recentContext = [], currentSender = "Friend", roomMembers = []) {
  return analyzeChatMessage(text, recentContext, currentSender, roomMembers);
}
