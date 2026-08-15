import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Settings() {
  const { changePassword } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLanguage();

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState(null);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (form.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('passwordTooShort') });
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsNoMatch') });
      return;
    }

    const result = changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    if (!result.success) {
      setMessage({ type: 'error', text: result.message });
      return;
    }

    setMessage({ type: 'success', text: t('saveChanges') + ' ✓' });
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('settings')}</div>
      </div>

      <div className="card" style={{ maxWidth: 520, marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>
          {t('theme')}
        </div>
        <div className="settings-row">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {theme === 'dark' ? t('darkMode') : t('lightMode')}
            </div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </div>
          </div>
          <button
            className={`toggle-switch${theme === 'dark' ? ' on' : ''}`}
            onClick={toggleTheme}
            aria-label="toggle theme"
          >
            <span className="knob" />
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520, marginBottom: 20 }}>
        <div className="section-title" style={{ marginBottom: 4 }}>
          {t('language')}
        </div>
        <div className="settings-row">
          <div style={{ fontWeight: 600, fontSize: 14 }}>{lang === 'en' ? 'English' : 'বাংলা'}</div>
          <button className={`toggle-switch${lang === 'bn' ? ' on' : ''}`} onClick={toggleLang}>
            <span className="knob" />
          </button>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        <div className="section-title" style={{ marginBottom: 16 }}>
          {t('changePassword')}
        </div>

        {message && (
          <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('currentPassword')}</label>
            <input
              type="password"
              value={form.currentPassword}
              onChange={(e) => set('currentPassword', e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>{t('newPassword')}</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => set('newPassword', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>{t('confirmPassword')}</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {t('saveChanges')}
          </button>
        </form>
      </div>
    </div>
  );
}
