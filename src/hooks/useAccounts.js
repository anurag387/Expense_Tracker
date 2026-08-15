import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

export default function useAccounts(userId) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setAccounts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/accounts')
      .then((list) => active && setAccounts(list))
      .catch(() => active && setAccounts([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  async function addAccount(name) {
    const record = await api.post('/accounts', { name });
    setAccounts((list) => [...list, record]);
    return record;
  }

  async function updateAccount(id, name) {
    const record = await api.put(`/accounts/${id}`, { name });
    setAccounts((list) => list.map((a) => (a.id === id ? record : a)));
    return record;
  }

  async function deleteAccount(id) {
    await api.del(`/accounts/${id}`);
    setAccounts((list) => list.filter((a) => a.id !== id));
  }

  return { accounts, addAccount, updateAccount, deleteAccount, loading };
}
