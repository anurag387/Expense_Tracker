import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { monthLabel, formatCurrency } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function SpendingLineChart({ data }) {
  const { lang, t } = useLanguage();
  const chartData = data.map((d) => ({
    name: monthLabel(d.month, lang),
    [t('expense')]: d.expense,
    [t('income')]: d.income,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData}>
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
        <Line
          type="monotone"
          dataKey={t('expense')}
          stroke="var(--expense)"
          strokeWidth={2.5}
          dot={false}
          animationDuration={600}
        />
        <Line
          type="monotone"
          dataKey={t('income')}
          stroke="var(--income)"
          strokeWidth={2.5}
          dot={false}
          animationDuration={600}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
