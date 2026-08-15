import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useCategories from '../hooks/useCategories.js';
import useTransactions from '../hooks/useTransactions.js';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart.jsx';
import SpendingLineChart from '../components/charts/SpendingLineChart.jsx';
import CategoryDonutChart from '../components/charts/CategoryDonutChart.jsx';
import CategoryBreakdownList from '../components/CategoryBreakdownList.jsx';
import {
  computeMonthlySeries,
  computeCategoryBreakdown,
  availableYears,
  filterTransactions,
} from '../utils/calculations.js';

export default function Statistics() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { categories } = useCategories(user?.id);
  const { transactions } = useTransactions(user?.id);

  const years = useMemo(() => availableYears(transactions), [transactions]);
  const [year, setYear] = useState(years[0] || new Date().getFullYear());

  const series = useMemo(() => computeMonthlySeries(transactions, year), [transactions, year]);
  const yearTransactions = useMemo(
    () => filterTransactions(transactions, { year }),
    [transactions, year]
  );
  const breakdown = useMemo(
    () => computeCategoryBreakdown(yearTransactions, categories),
    [yearTransactions, categories]
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('statistics')}</div>
        <div className="filters">
          <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          {t('incomeVsExpense')}
        </div>
        <IncomeExpenseBarChart data={series} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 12 }}>
          {t('spendingTrend')}
        </div>
        <SpendingLineChart data={series} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title" style={{ marginBottom: 8 }}>
            {t('categoryBreakdown')}
          </div>
          <CategoryDonutChart data={breakdown} />
        </div>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>
            {t('categoryStatistics')}
          </div>
          <CategoryBreakdownList data={breakdown} />
        </div>
      </div>
    </div>
  );
}
