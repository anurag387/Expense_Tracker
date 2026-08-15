import useLocalStorageState from './useLocalStorageState.js';
import { uid } from '../utils/storage.js';

export default function useTransactions(userId) {
  const storageKey = userId ? `etrack_transactions_${userId}` : null;
  const [transactions, setTransactions] = useLocalStorageState(storageKey, []);
  const list = transactions || [];

  function addTransaction(data) {
    const record = { id: uid('txn'), createdAt: new Date().toISOString(), ...data };
    setTransactions([record, ...list]);
    return record;
  }

  function updateTransaction(id, patch) {
    setTransactions(list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function deleteTransaction(id) {
    setTransactions(list.filter((t) => t.id !== id));
  }

  return { transactions: list, addTransaction, updateTransaction, deleteTransaction };
}
