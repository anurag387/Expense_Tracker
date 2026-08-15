import { useEffect, useState } from 'react';
import { api } from '../utils/api.js';

export default function useReminders(userId) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setReminders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get('/reminders')
      .then((list) => active && setReminders(list))
      .catch(() => active && setReminders([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  async function addReminder(data) {
    const record = await api.post('/reminders', data);
    setReminders((list) => [record, ...list]);
    return record;
  }

  async function updateReminder(id, patch) {
    const record = await api.put(`/reminders/${id}`, patch);
    setReminders((list) => list.map((r) => (r.id === id ? record : r)));
    return record;
  }

  async function toggleReminder(id) {
    const record = await api.post(`/reminders/${id}/toggle`);
    setReminders((list) => list.map((r) => (r.id === id ? record : r)));
    return record;
  }

  async function deleteReminder(id) {
    await api.del(`/reminders/${id}`);
    setReminders((list) => list.filter((r) => r.id !== id));
  }

  return { reminders, addReminder, updateReminder, toggleReminder, deleteReminder, loading };
}
