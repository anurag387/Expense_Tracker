import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categoryName } from '../hooks/useCategories.js';
import { dictionaries } from '../i18n/index.js';
import { todayISO } from '../utils/format.js';

const EMPTY = {
  type: 'expense',
  title: '',
  amount: '',
  categoryId: '',
  accountId: '',
  date: todayISO(),
  note: '',
};

export default function TransactionModal({ open, onClose, onSubmit, categories, accounts, initial }) {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initial) {
        setForm({
          type: initial.type,
          title: initial.title,
          amount: String(initial.amount),
          categoryId: initial.categoryId || '',
          accountId: initial.accountId || '',
          date: initial.date,
          note: initial.note || '',
        });
      } else {
        setForm({
          ...EMPTY,
          categoryId: categories[0]?.id || '',
          accountId: accounts[0]?.id || '',
        });
      }
    }
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = t('requiredField');
    const amt = Number(form.amount);
    if (!form.amount || Number.isNaN(amt) || amt <= 0) next.amount = t('amountMustBePositive');
    if (!form.date) next.date = t('requiredField');
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <div className="section-title">{initial ? t('editTransaction') : t('addTransaction')}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="type-toggle">
            <button
              type="button"
              className={form.type === 'expense' ? 'active-expense' : ''}
              onClick={() => set('type', 'expense')}
            >
              {t('expense')}
            </button>
            <button
              type="button"
              className={form.type === 'income' ? 'active-income' : ''}
              onClick={() => set('type', 'income')}
            >
              {t('income')}
            </button>
          </div>

          <div className="form-group">
            <label>{t('title')}</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} />
            {errors.title && <div className="form-error">{errors.title}</div>}
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
              {errors.amount && <div className="form-error">{errors.amount}</div>}
            </div>
            <div className="form-group">
              <label>{t('date')}</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
              {errors.date && <div className="form-error">{errors.date}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('category')}</label>
              <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {categoryName(c, dictionaries, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>{t('account')}</label>
              <select value={form.accountId} onChange={(e) => set('accountId', e.target.value)}>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
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
              {t('saveTransaction')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
