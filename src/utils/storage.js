// Small wrapper around localStorage that always deals in JSON.
// The whole app is frontend-only, so this file plays the role that a
// real backend + database would play in a full-stack version of this project.

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read "${key}" from storage`, err);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write "${key}" to storage`, err);
  }
}

export function removeKey(key) {
  localStorage.removeItem(key);
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
