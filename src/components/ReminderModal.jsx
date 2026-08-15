import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { todayISO } from '../utils/format.js';

const EMPTY = { title: '', amount: '', dueDate: todayISO(), note: '' };

export default function ReminderModal({ open, onClose, onSubmit, initial }) {
  const { t } = useLanguage();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      setForm(
        initial
          ? {
              title: initial.title,
              amount: initial.amount ? String(initial.amount) : '',
              dueDate: initial.dueDate,
              note: initial.note || '',
            }
          : EMPTY
      );
    }
  }, [open, initial]);

  if (!open) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError(t('requiredField'));
      return;
    }
    onSubmit({ ...form, amount: form.amount ? Number(form.amount) : null });
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div className="section-title">{initial ? t('editReminder') : t('addReminder')}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('reminderTitle')}</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} />
            {error && <div className="form-error">{error}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('amount')}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>{t('dueDate')}</label>
              <input type="date" value={form.dueDate} onChange={(e) => set('dueDate', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label>{t('note')}</label>
            <textarea rows={2} value={form.note} onChange={(e) => set('note', e.target.value)} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
