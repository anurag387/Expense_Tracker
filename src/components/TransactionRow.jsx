import React from 'react';
import { formatCurrency, formatDate } from '../utils/format.js';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categoryName } from '../hooks/useCategories.js';
import { dictionaries } from '../i18n/index.js';

export default function TransactionRow({ transaction, category, account, onEdit, onDelete }) {
  const { t, lang } = useLanguage();
  const isIncome = transaction.type === 'income';

  return (
    <div className="list-item list-item-enter">
      <div
        className="list-icon"
        style={{
          background: isIncome ? 'rgba(67,240,167,0.14)' : `${category?.color || '#8792a5'}22`,
          color: isIncome ? 'var(--income)' : category?.color || 'var(--text-muted)',
        }}
      >
        {isIncome ? '💵' : category?.icon || '📦'}
      </div>
      <div className="grow">
        <div className="title">{transaction.title}</div>
        <div className="meta">
          {category ? categoryName(category, dictionaries, lang) : t('all')} · {account?.name || ''} ·{' '}
          {formatDate(transaction.date, lang)}
        </div>
      </div>
      <div className={`amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
        {formatCurrency(isIncome ? transaction.amount : -transaction.amount, { sign: true })}
      </div>
      <div className="list-actions">
        <button className="icon-btn" onClick={() => onEdit(transaction)} title={t('edit')}>
          ✎
        </button>
        <button className="icon-btn" onClick={() => onDelete(transaction)} title={t('delete')}>
          🗑
        </button>
      </div>
    </div>
  );
}
