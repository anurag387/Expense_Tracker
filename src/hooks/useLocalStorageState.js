import { useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';

// Behaves like useState, but persists the value under `key` in localStorage
// and re-hydrates from it on mount / whenever `key` changes (e.g. switching
// between user accounts, since each user's data is namespaced by userId).
export default function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(() => readJSON(key, initialValue));

  useEffect(() => {
    setValue(readJSON(key, initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (key) writeJSON(key, value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, value]);

  return [value, setValue];
}
