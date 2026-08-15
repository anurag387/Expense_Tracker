import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import AuthLangThemeBar from '../components/AuthLangThemeBar.jsx';

export default function ForgotPassword() {
  const { requestPasswordReset } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const result = requestPasswordReset(email);
    setMessage(result);
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <AuthLangThemeBar />
        <h1>{t('forgotPassword')}</h1>
        <p className="subtitle">{t('enterEmail')}</p>

        {message && (
          <div className={`alert ${message.success ? 'alert-success' : 'alert-error'}`}>
            {message.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('email')}</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            {t('sendResetLink')}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="link">{t('backToLogin')}</Link>
        </div>
      </div>
    </div>
  );
}
