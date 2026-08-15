import { uid } from '../db.js';

// Mirrors the defaults the old localStorage-only version used to create for
// every new user, so behavior stays the same after adding the backend.
export function buildDefaultCategories(userId) {
  const defs = [
    { key: 'food', icon: '🍔', color: '#ff9f5a' },
    { key: 'groceries', icon: '🛒', color: '#43f0a7' },
    { key: 'transport', icon: '🚌', color: '#16a8ff' },
    { key: 'shopping', icon: '🛍️', color: '#8d7cff' },
    { key: 'bills', icon: '🧾', color: '#ffd84d' },
    { key: 'health', icon: '💊', color: '#ff6f86' },
    { key: 'entertainment', icon: '🎬', color: '#5ad1ff' },
    { key: 'salary', icon: '💼', color: '#43f0a7' },
    { key: 'other', icon: '📦', color: '#8792a5' },
  ];
  return defs.map((d) => ({ id: uid('cat'), userId, ...d }));
}

export function buildDefaultAccounts(userId) {
  return [
    { id: uid('acc'), userId, name: 'Cash' },
    { id: uid('acc'), userId, name: 'Bank' },
  ];
}
