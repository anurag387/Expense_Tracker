import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { monthLabel, formatCurrency } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function IncomeExpenseBarChart({ data }) {
  const { lang, t } = useLanguage();
  const chartData = data.map((d) => ({
    name: monthLabel(d.month, lang),
    [t('income')]: d.income,
    [t('expense')]: d.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={40} />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-primary)',
          }}
          formatter={(value) => formatCurrency(value)}
        />
        <Bar dataKey={t('income')} fill="var(--income)" radius={[6, 6, 0, 0]} animationDuration={500} />
        <Bar dataKey={t('expense')} fill="var(--expense)" radius={[6, 6, 0, 0]} animationDuration={500} />
      </BarChart>
    </ResponsiveContainer>
  );
}
