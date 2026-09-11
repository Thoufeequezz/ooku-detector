/**
 * Helper Utility functions
 */

export function formatTimestamp(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export function getIntensityBadgeClass(score) {
  if (score >= 76) return "bg-rose-500/20 text-rose-300 border-rose-500/40";
  if (score >= 41) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  return "bg-teal-500/20 text-teal-300 border-teal-500/40";
}
