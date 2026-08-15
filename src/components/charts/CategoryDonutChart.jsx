import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/format.js';
import { useLanguage } from '../../context/LanguageContext.jsx';

export default function CategoryDonutChart({ data }) {
  const { t } = useLanguage();

  if (!data.length) {
    return (
      <div className="empty-state" style={{ padding: '30px 10px' }}>
        <div className="emoji">🍩</div>
        <div>{t('noExpensesYet')}</div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          animationDuration={500}
        >
          {data.map((entry) => (
            <Cell key={entry.categoryId} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            color: 'var(--text-primary)',
          }}
          formatter={(value, name) => [formatCurrency(value), name]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
