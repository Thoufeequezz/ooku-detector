/**
 * FRIENDSHIP OS - Ooku Fallback Keyword & Pattern Score Classifier
 * Guarantees Ooku detection for dataset matches and Manglish roast patterns.
 */

import { ookuDataset } from '../data/ookuDataset';

const NORMAL_EXACT_PHRASES = [
  "eda evideya", "bro evidea ullath?", "food kazhicho", "good morning guys",
  "good morning bro", "good night da", "hi guys", "hello bro", "bro nee innu pwoli aanu",
  "machane class thudangiyo", "innu lab undo guys?", "notes undo aarde kayyilum?",
  "njan 5 mins il ethum", "njan varunnund", "canteenil poyalo?", "tea kudichalo da",
  "assignment submission eppo aanu?", "ok bro, done", "thanks da", "super work man!",
  "see you tomorrow", "da project group undakkiyo?", "sir class edukkunnundo?",
  "machane link onnu ayache", "da PDF share cheyyuvo?", "where are you", "coming", "ok", "bye"
];

// Expanded Manglish Roast Keywords derived from 180+ dataset examples
const MANGLISH_ROAST_KEYWORDS = [
  "poda", "manda", "potta", "patti", "pottan", "kazhutha", "nanam", "kazhiv", "kindi",
  "undaa", "dharidhram", "oodra", "pennu", "monna", "shotta", "undayip", "kallaaa", "thala",
  "adi", "panikum", "oodikoo", "thiriv", "budhi", "lokha", "sambar", "vayithaalam", "kolam",
  "mannu", "vatt", "tholvi", "urangu", "sambhavam", "waste", "chali", "comedy", "brain",
  "item", "mindathe", "confidence", "dialogue", "pavam", "flop", "failure", "slow", "useless",
  "show", "kashtam", "logic", "disaster", "bore", "talent", "attitudinal", "arrogant", "ego",
  "mosham", "maire", "syndicate", "void", "burj khalifa", "isro", "oxford"
];

export function classifyOokuFallback(text, recentContext = [], speaker = "Friend", inferredTarget = null) {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return { label: "NORMAL", isOoku: false, speaker, target: null, intensity: 0, confidence: 0.95 };
  }

  const lower = text.toLowerCase().trim();

  // 1. Direct dataset lookup match
  const datasetMatch = ookuDataset.find(
    (ex) => ex.text.toLowerCase().trim() === lower || lower.includes(ex.text.toLowerCase().trim())
  );

  if (datasetMatch) {
    if (datasetMatch.label === 'NORMAL') {
      return { label: "NORMAL", isOoku: false, speaker, target: null, intensity: 0, confidence: 0.98 };
    } else {
      return {
        label: datasetMatch.label,
        isOoku: true,
        speaker,
        target: inferredTarget,
        intensity: datasetMatch.intensity || 7,
        confidence: 0.95
      };
    }
  }

  // 2. Check exact normal everyday messages
  if (NORMAL_EXACT_PHRASES.some(phrase => lower === phrase || lower === `${phrase}?` || lower === `${phrase}!`)) {
    return { label: "NORMAL", isOoku: false, speaker, target: null, intensity: 0, confidence: 0.95 };
  }

  // 3. Keyword / Pattern Scoring
  let score = 0;

  // Manglish roast keyword match -> +2
  if (MANGLISH_ROAST_KEYWORDS.some(kw => lower.includes(kw))) {
    score += 2;
  }

  // Check target pronouns -> +1
  if (["ninte", "nee", "avan", "avale", "ninne"].some(p => lower.includes(p))) {
    score += 1;
  }

  // Check laughing/skull emojis -> +1
  if (lower.includes("😂") || lower.includes("💀") || lower.includes("😭")) {
    score += 1;
  }

  if (score >= 2) {
    let label = "OOKU";
    if (lower.includes("maire") || score >= 4) {
      label = "CRITICAL_OOKU";
    } else if (lower.includes("thirichu") || lower.includes("njan") || lower.includes("nokkikko")) {
      label = "COUNTER_OOKU";
    }

    return {
      label,
      isOoku: true,
      speaker,
      target: inferredTarget,
      intensity: Math.min(10, Math.max(5, score * 2)),
      confidence: 0.90
    };
  }

  return {
    label: "NORMAL",
    isOoku: false,
    speaker,
    target: null,
    intensity: 0,
    confidence: 0.90
  };
}
