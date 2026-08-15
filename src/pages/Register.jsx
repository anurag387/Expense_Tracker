import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import AuthLangThemeBar from '../components/AuthLangThemeBar.jsx';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setErrors((prev) => ({ ...prev, photo: 'Image must be under 2MB' }));
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, photo: 'JPG, PNG or WebP only' }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setErrors((prev) => ({ ...prev, photo: undefined }));
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = t('requiredField');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('invalidEmail');
    if (form.password.length < 6) next.password = t('passwordTooShort');
    if (form.password !== form.confirmPassword) next.confirmPassword = t('passwordsNoMatch');
    setErrors((prev) => ({ ...prev, ...next }));
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    const result = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      photo,
    });
    setSubmitting(false);

    if (!result.success) {
      setServerError(result.message);
      return;
    }
    navigate('/', { replace: true });
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <AuthLangThemeBar />
        <h1>{t('createAccount')}</h1>
        <p className="subtitle">{t('registerSubtitle')}</p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('profilePhoto')}</label>
            <div className="photo-upload">
              {photo ? (
                <img src={photo} alt="preview" className="avatar" />
              ) : (
                <div className="avatar">{form.name.charAt(0).toUpperCase() || '?'}</div>
              )}
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                {t('uploadPhoto')}
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} hidden />
              </label>
            </div>
            {errors.photo && <div className="form-error">{errors.photo}</div>}
          </div>

          <div className="form-group">
            <label>{t('fullName')}</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label>{t('email')}</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{t('password')}</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
              />
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>
            <div className="form-group">
              <label>{t('confirmPassword')}</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => set('confirmPassword', e.target.value)}
              />
              {errors.confirmPassword && <div className="form-error">{errors.confirmPassword}</div>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? '...' : t('createAccount')}
          </button>
        </form>

        <div className="auth-footer">
          {t('haveAccount')} <Link to="/login" className="link">{t('login')}</Link>
        </div>
      </div>
    </div>
  );
}
