import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useReminders from '../hooks/useReminders.js';
import ReminderModal from '../components/ReminderModal.jsx';
import { formatCurrency, formatDate } from '../utils/format.js';

export default function Reminders() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { reminders, addReminder, updateReminder, toggleReminder, deleteReminder } = useReminders(user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const sorted = useMemo(
    () => [...reminders].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
    [reminders]
  );

  function handleSubmit(data) {
    if (editing) updateReminder(editing.id, data);
    else addReminder(data);
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete(r) {
    if (window.confirm(t('confirmDeleteReminder'))) {
      deleteReminder(r.id);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('reminders')}</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + {t('addReminder')}
        </button>
      </div>

      <div className="card">
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">⏰</div>
            <div>{t('noRemindersYet')}</div>
          </div>
        ) : (
          sorted.map((r) => (
            <div className={`list-item reminder-item${r.done ? ' done' : ''}`} key={r.id}>
              <button
                className={`checkbox-circle${r.done ? ' checked' : ''}`}
                onClick={() => toggleReminder(r.id)}
                title={r.done ? t('markIncomplete') : t('markComplete')}
              >
                {r.done ? '✓' : ''}
              </button>
              <div className="grow">
                <div className="title">{r.title}</div>
                <div className="meta">
                  {formatDate(r.dueDate, lang)}
                  {r.note ? ` · ${r.note}` : ''}
                </div>
              </div>
              {r.amount ? <div className="amount">{formatCurrency(r.amount)}</div> : null}
              <div className="list-actions">
                <button
                  className="icon-btn"
                  onClick={() => {
                    setEditing(r);
                    setModalOpen(true);
                  }}
                  title={t('edit')}
                >
                  ✎
                </button>
                <button className="icon-btn" onClick={() => handleDelete(r)} title={t('delete')}>
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ReminderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
