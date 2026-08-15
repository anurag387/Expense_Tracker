import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useCategories from '../hooks/useCategories.js';
import useAccounts from '../hooks/useAccounts.js';
import useTransactions from '../hooks/useTransactions.js';
import TransactionRow from '../components/TransactionRow.jsx';
import TransactionModal from '../components/TransactionModal.jsx';
import { filterTransactions, availableYears } from '../utils/calculations.js';
import { categoryName } from '../hooks/useCategories.js';
import { dictionaries } from '../i18n/index.js';

export default function Transactions() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { openAddModal } = useOutletContext();

  const { categories } = useCategories(user?.id);
  const { accounts } = useAccounts(user?.id);
  const { transactions, updateTransaction, deleteTransaction } = useTransactions(user?.id);

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('all');
  const [year, setYear] = useState('all');
  const [categoryId, setCategoryId] = useState('all');
  const [editing, setEditing] = useState(null);

  const years = useMemo(() => availableYears(transactions), [transactions]);

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, {
        type: tab === 'all' ? 'all' : tab,
        search,
        month,
        year,
        categoryId,
      }).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [transactions, tab, search, month, year, categoryId]
  );

  function handleDelete(tx) {
    if (window.confirm(t('confirmDeleteTransaction'))) {
      deleteTransaction(tx.id);
    }
  }

  function handleEditSubmit(data) {
    updateTransaction(editing.id, data);
    setEditing(null);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('transactions')}</div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + {t('addNew')}
        </button>
      </div>

      <div className="tabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>
          {t('all')}
        </button>
        <button className={tab === 'income' ? 'active' : ''} onClick={() => setTab('income')}>
          {t('income')}
        </button>
        <button className={tab === 'expense' ? 'active' : ''} onClick={() => setTab('expense')}>
          {t('expense')}
        </button>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="filters" style={{ marginBottom: 0 }}>
          <div className="search-bar">
            <span>🔍</span>
            <input
              placeholder={t('searchTransactions')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="all">{t('category')}: {t('all')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {categoryName(c, dictionaries, lang)}
              </option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
            <option value="all">{t('allMonths')}</option>
            {Array.from({ length: 12 }, (_, i) => i).map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m, 1).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
            <option value="all">{t('year')}: {t('all')}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🧾</div>
            <div>{t('noTransactionsYet')}</div>
            <div style={{ fontSize: 13 }}>{t('addFirstTransaction')}</div>
          </div>
        ) : (
          filtered.map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              category={categories.find((c) => c.id === tx.categoryId)}
              account={accounts.find((a) => a.id === tx.accountId)}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <TransactionModal
        open={!!editing}
        onClose={() => setEditing(null)}
        onSubmit={handleEditSubmit}
        categories={categories}
        accounts={accounts}
        initial={editing}
      />
    </div>
  );
}
