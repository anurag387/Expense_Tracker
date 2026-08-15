import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function CategoryBreakdownList({ data }) {
  const { t } = useLanguage();

  if (!data.length) {
    return (
      <div className="empty-state" style={{ padding: '30px 10px' }}>
        <div className="emoji">🏷️</div>
        <div>{t('noExpensesYet')}</div>
      </div>
    );
  }

  return (
    <div>
      {data.slice(0, 6).map((c) => (
        <div className="category-row" key={c.categoryId}>
          <div className="cat-label">
            <span className="dot" style={{ background: c.color }} />
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {c.icon} {c.name}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-bar-fill"
              style={{ width: `${c.percent}%`, background: c.color }}
            />
          </div>
          <div className="pct">{c.percent}%</div>
        </div>
      ))}
    </div>
  );
}
