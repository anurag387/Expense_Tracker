import React, { useMemo, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useCategories from '../hooks/useCategories.js';
import useAccounts from '../hooks/useAccounts.js';
import useTransactions from '../hooks/useTransactions.js';
import useReminders from '../hooks/useReminders.js';
import SummaryCard from '../components/SummaryCard.jsx';
import CategoryBreakdownList from '../components/CategoryBreakdownList.jsx';
import CategoryDonutChart from '../components/charts/CategoryDonutChart.jsx';
import TransactionRow from '../components/TransactionRow.jsx';
import TransactionModal from '../components/TransactionModal.jsx';
import {
  filterTransactions,
  computeSummary,
  computeTrend,
  computeCategoryBreakdown,
  availableYears,
} from '../utils/calculations.js';
import { formatDate, formatCurrency } from '../utils/format.js';

export default function Dashboard() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { openAddModal } = useOutletContext();

  const { categories } = useCategories(user?.id);
  const { accounts } = useAccounts(user?.id);
  const { transactions, updateTransaction, deleteTransaction } = useTransactions(user?.id);
  const { reminders } = useReminders(user?.id);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [accountId, setAccountId] = useState('all');
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(
    () => filterTransactions(transactions, { month, year, accountId }),
    [transactions, month, year, accountId]
  );

  const summary = useMemo(() => computeSummary(filtered), [filtered]);
  const trend = useMemo(() => computeTrend(transactions, { month, year }), [transactions, month, year]);
  const breakdown = useMemo(() => computeCategoryBreakdown(filtered, categories), [filtered, categories]);
  const years = useMemo(() => availableYears(transactions), [transactions]);
  const recent = useMemo(() => [...filtered].slice(0, 5), [filtered]);

  const upcomingReminders = useMemo(
    () =>
      [...reminders]
        .filter((r) => !r.done)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4),
    [reminders]
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

  const months = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{t('myDashboard')}</div>
        </div>
        <div className="filters">
          <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
            <option value="all">{t('allAccounts')}</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <select value={month} onChange={(e) => setMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}>
            <option value="all">{t('allMonths')}</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {new Date(2024, m, 1).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { month: 'long' })}
              </option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={openAddModal}>
            + {t('addNew')}
          </button>
        </div>
      </div>

      <div className="grid-3">
        <SummaryCard
          variant="balance"
          label={t('balance')}
          amount={summary.balance}
          count={summary.total}
          changePct={trend.balanceChange}
        />
        <SummaryCard
          variant="expense"
          label={t('expense')}
          amount={summary.expense}
          count={summary.expenseCount}
          changePct={trend.expenseChange}
        />
        <SummaryCard
          variant="income"
          label={t('income')}
          amount={summary.income}
          count={summary.incomeCount}
          changePct={trend.incomeChange}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            {t('categoryStatistics')}
          </div>
          <CategoryBreakdownList data={breakdown} />
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 8 }}>
            {t('categoryBreakdown')}
          </div>
          <CategoryDonutChart data={breakdown} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
          >
            <div className="section-title">{t('recentTransactions')}</div>
            <Link to="/transactions" className="link" style={{ fontSize: 13 }}>
              {t('viewAll')}
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">🧾</div>
              <div>{t('noTransactionsYet')}</div>
              <div style={{ fontSize: 13 }}>{t('addFirstTransaction')}</div>
            </div>
          ) : (
            recent.map((tx) => (
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

        <div className="card">
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
          >
            <div className="section-title">{t('upcomingReminders')}</div>
            <Link to="/reminders" className="link" style={{ fontSize: 13 }}>
              {t('viewAll')}
            </Link>
          </div>
          {upcomingReminders.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">⏰</div>
              <div>{t('noRemindersYet')}</div>
            </div>
          ) : (
            upcomingReminders.map((r) => (
              <div className="list-item" key={r.id}>
                <div className="list-icon" style={{ background: 'rgba(255,216,77,0.14)', color: 'var(--warning)' }}>
                  ⏰
                </div>
                <div className="grow">
                  <div className="title">{r.title}</div>
                  <div className="meta">{formatDate(r.dueDate, lang)}</div>
                </div>
                {r.amount ? <div className="amount">{formatCurrency(r.amount)}</div> : null}
              </div>
            ))
          )}
        </div>
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
