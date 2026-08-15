import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

const PALETTE = ['#16a8ff', '#43f0a7', '#ff6f86', '#ffd84d', '#8d7cff', '#ff9f5a', '#5ad1ff', '#c084fc'];

export function categoryName(category, dictionaries, lang) {
  if (!category) return 'Uncategorized';
  if (category.key) {
    return dictionaries[lang]?.[category.key] || category.key;
  }
  return category.name || 'Untitled';
}

export default function useCategories(userId) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setCategories([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/categories')
      .then((list) => active && setCategories(list))
      .catch(() => active && setCategories([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  async function addCategory({ name, icon, color }) {
    const record = await api.post('/categories', { name, icon, color });
    setCategories((list) => [...list, record]);
    return record;
  }

  async function updateCategory(id, patch) {
    const record = await api.put(`/categories/${id}`, patch);
    setCategories((list) => list.map((c) => (c.id === id ? record : c)));
    return record;
  }

  async function deleteCategory(id) {
    await api.del(`/categories/${id}`);
    setCategories((list) => list.filter((c) => c.id !== id));
  }

  return { categories, addCategory, updateCategory, deleteCategory, palette: PALETTE, loading };
}
