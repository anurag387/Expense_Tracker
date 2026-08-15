import useLocalStorageState from './useLocalStorageState.js';
import { uid } from '../utils/storage.js';

export default function useReminders(userId) {
  const storageKey = userId ? `etrack_reminders_${userId}` : null;
  const [reminders, setReminders] = useLocalStorageState(storageKey, []);
  const list = reminders || [];

  function addReminder(data) {
    const record = { id: uid('rem'), done: false, createdAt: new Date().toISOString(), ...data };
    setReminders([record, ...list]);
  }

  function updateReminder(id, patch) {
    setReminders(list.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function toggleReminder(id) {
    setReminders(list.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  }

  function deleteReminder(id) {
    setReminders(list.filter((r) => r.id !== id));
  }

  return { reminders: list, addReminder, updateReminder, toggleReminder, deleteReminder };
}
