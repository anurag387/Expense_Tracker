import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

export default function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/transactions')
      .then((list) => active && setTransactions(list))
      .catch(() => active && setTransactions([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  async function addTransaction(data) {
    const record = await api.post('/transactions', data);
    setTransactions((list) => [record, ...list]);
    return record;
  }

  async function updateTransaction(id, patch) {
    const record = await api.put(`/transactions/${id}`, patch);
    setTransactions((list) => list.map((t) => (t.id === id ? record : t)));
    return record;
  }

  async function deleteTransaction(id) {
    await api.del(`/transactions/${id}`);
    setTransactions((list) => list.filter((t) => t.id !== id));
  }

  return { transactions, addTransaction, updateTransaction, deleteTransaction, loading };
}
