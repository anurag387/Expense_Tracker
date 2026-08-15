import React from 'react';
import { formatCurrency } from '../utils/format.js';
import { useLanguage } from '../context/LanguageContext.jsx';

const VARIANTS = {
  balance: { icon: '💰', bg: 'rgba(22,168,255,0.14)', color: 'var(--primary)' },
  income: { icon: '📈', bg: 'rgba(67,240,167,0.14)', color: 'var(--income)' },
  expense: { icon: '📉', bg: 'rgba(255,111,134,0.14)', color: 'var(--expense)' },
};

export default function SummaryCard({ variant, label, amount, count, changePct, signed }) {
  const { t } = useLanguage();
  const v = VARIANTS[variant];
  const showChange = changePct !== null && changePct !== undefined;

  return (
    <div className="card summary-card">
      <div className="label-row">
        <div>
          <div className="section-title">{label}</div>
          <div className="text-muted" style={{ fontSize: 13, marginTop: 2 }}>
            {count} {count === 1 ? t('transactionCount') : t('transactionsCount')}
          </div>
        </div>
        <div className="icon-badge" style={{ background: v.bg, color: v.color }}>
          {v.icon}
        </div>
      </div>
      <div className="amount" style={{ color: variant === 'balance' ? 'var(--text-primary)' : v.color }}>
        {formatCurrency(amount, { sign: signed })}
      </div>
      {showChange && (
        <div className="sub-row">
          <span className={changePct >= 0 ? 'badge-up' : 'badge-down'}>
            {changePct >= 0 ? '+' : ''}
            {changePct}%
          </span>
          <span className="text-muted">vs last month</span>
        </div>
      )}
    </div>
  );
}
