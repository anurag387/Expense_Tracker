import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'dashboard', icon: '📊', end: true },
  { to: '/transactions', label: 'transactions', icon: '💳' },
  { to: '/categories', label: 'categories', icon: '🏷️' },
  { to: '/statistics', label: 'statistics', icon: '📈' },
  { to: '/reminders', label: 'reminders', icon: '⏰' },
];

export default function Sidebar({ onAddNew }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="dot" />
        <span>{t('appName')}</span>
      </div>

      <div className="sidebar-profile">
        {user?.photo ? (
          <img src={user.photo} alt={user.name} />
        ) : (
          <div className="avatar">{(user?.name || '?').charAt(0).toUpperCase()}</div>
        )}
        <div>
          <div className="name">{user?.name}</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>

      <button className="btn-add-new" onClick={onAddNew}>
        <span>+</span> {t('addNew')}
      </button>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span>{t(item.label)}</span>
          </NavLink>
        ))}

        <div className="sidebar-section-label">{t('settings')}</div>
        <NavLink to="/profile" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">👤</span>
          <span>{t('profile')}</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
          <span className="icon">⚙️</span>
          <span>{t('settings')}</span>
        </NavLink>
      </nav>

      <button className="sidebar-logout" onClick={logout}>
        <span className="icon">🚪</span>
        <span>{t('logout')}</span>
      </button>
    </aside>
  );
}
