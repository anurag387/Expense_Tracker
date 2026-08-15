import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';

const ITEMS = [
  { to: '/', label: 'dashboard', icon: '📊', end: true },
  { to: '/transactions', label: 'transactions', icon: '💳' },
  { to: '/statistics', label: 'statistics', icon: '📈' },
  { to: '/reminders', label: 'reminders', icon: '⏰' },
  { to: '/profile', label: 'profile', icon: '👤' },
];

export default function MobileNav() {
  const { t } = useLanguage();
  return (
    <nav className="mobile-nav">
      {ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          <span>{item.icon}</span>
          <span>{t(item.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
