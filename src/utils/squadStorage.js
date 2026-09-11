/**
 * Squad LocalStorage Helper Utility
 */

const STORAGE_KEY = "friendship_os_squad";
const DEFAULT_NAMES = ["Thoufeek", "Adil", "Suhail", "Fayiz"];

export function getSavedSquad() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load squad from localStorage:", e);
  }
  return DEFAULT_NAMES;
}

export function saveSquad(squadArray) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(squadArray));
  } catch (e) {
    console.warn("Failed to save squad to localStorage:", e);
  }
}
