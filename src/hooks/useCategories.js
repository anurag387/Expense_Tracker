import { useEffect, useMemo } from 'react';
import useLocalStorageState from './useLocalStorageState.js';
import { uid } from '../utils/storage.js';

const PALETTE = ['#16a8ff', '#43f0a7', '#ff6f86', '#ffd84d', '#8d7cff', '#ff9f5a', '#5ad1ff', '#c084fc'];

function buildDefaultCategories() {
  return [
    { id: uid('cat'), key: 'food', icon: '🍔', color: '#ff9f5a' },
    { id: uid('cat'), key: 'groceries', icon: '🛒', color: '#43f0a7' },
    { id: uid('cat'), key: 'transport', icon: '🚌', color: '#16a8ff' },
    { id: uid('cat'), key: 'shopping', icon: '🛍️', color: '#8d7cff' },
    { id: uid('cat'), key: 'bills', icon: '🧾', color: '#ffd84d' },
    { id: uid('cat'), key: 'health', icon: '💊', color: '#ff6f86' },
    { id: uid('cat'), key: 'entertainment', icon: '🎬', color: '#5ad1ff' },
    { id: uid('cat'), key: 'salary', icon: '💼', color: '#43f0a7' },
    { id: uid('cat'), key: 'other', icon: '📦', color: '#8792a5' },
  ];
}

export function categoryName(category, dictionaries, lang) {
  if (!category) return 'Uncategorized';
  if (category.key) {
    return dictionaries[lang]?.[category.key] || category.key;
  }
  return category.name || 'Untitled';
}

export default function useCategories(userId) {
  const storageKey = userId ? `etrack_categories_${userId}` : null;
  const [categories, setCategories] = useLocalStorageState(storageKey, undefined);

  // Stable across re-renders until it actually gets persisted.
  const defaults = useMemo(() => buildDefaultCategories(), [userId]);

  useEffect(() => {
    if (userId && categories === undefined) {
      setCategories(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, categories]);

  const list = categories === undefined ? defaults : categories;

  function addCategory({ name, icon, color }) {
    const next = [
      ...list,
      { id: uid('cat'), name, icon: icon || '📁', color: color || PALETTE[list.length % PALETTE.length] },
    ];
    setCategories(next);
  }

  function updateCategory(id, patch) {
    setCategories(
      list.map((c) => (c.id === id ? { ...c, ...patch, key: patch.name ? undefined : c.key } : c))
    );
  }

  function deleteCategory(id) {
    setCategories(list.filter((c) => c.id !== id));
  }

  return { categories: list, addCategory, updateCategory, deleteCategory, palette: PALETTE };
}
