import { useEffect, useMemo } from 'react';
import useLocalStorageState from './useLocalStorageState.js';
import { uid } from '../utils/storage.js';

function buildDefaultAccounts() {
  return [
    { id: uid('acc'), name: 'Cash' },
    { id: uid('acc'), name: 'Bank' },
  ];
}

export default function useAccounts(userId) {
  const storageKey = userId ? `etrack_accounts_${userId}` : null;
  const [accounts, setAccounts] = useLocalStorageState(storageKey, undefined);
  const defaults = useMemo(() => buildDefaultAccounts(), [userId]);

  useEffect(() => {
    if (userId && accounts === undefined) {
      setAccounts(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accounts]);

  const list = accounts === undefined ? defaults : accounts;

  function addAccount(name) {
    setAccounts([...list, { id: uid('acc'), name }]);
  }
  function updateAccount(id, name) {
    setAccounts(list.map((a) => (a.id === id ? { ...a, name } : a)));
  }
  function deleteAccount(id) {
    setAccounts(list.filter((a) => a.id !== id));
  }

  return { accounts: list, addAccount, updateAccount, deleteAccount };
}
