import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatDate } from '../utils/format.js';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { t, lang } = useLanguage();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photo, setPhoto] = useState(user?.photo || null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  function startEdit() {
    setName(user.name);
    setEmail(user.email);
    setPhoto(user.photo);
    setError('');
    setSaved(false);
    setEditing(true);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_PHOTO_BYTES) {
      setError('Image must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('requiredField'));
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(t('invalidEmail'));
      return;
    }
    const result = await updateProfile({ name: name.trim(), email: email.trim().toLowerCase(), photo });
    if (!result.success) {
      setError(result.message);
      return;
    }
    setEditing(false);
    setSaved(true);
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('profile')}</div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        {saved && !editing && <div className="alert alert-success">{t('saveChanges')} ✓</div>}

        {!editing ? (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="avatar"
                style={{ width: 88, height: 88, fontSize: 30, margin: '0 auto 16px' }}
              />
            ) : (
              <div
                className="avatar"
                style={{ width: 88, height: 88, fontSize: 30, margin: '0 auto 16px' }}
              >
                {(user?.name || '?').charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.name}</div>
            <div className="text-muted" style={{ marginBottom: 4 }}>{user?.email}</div>
            {user?.createdAt && (
              <div className="text-muted" style={{ fontSize: 12, marginBottom: 20 }}>
                {t('memberSince')} {formatDate(user.createdAt, lang)}
              </div>
            )}
            <button className="btn btn-primary" onClick={startEdit}>
              {t('editProfile')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-group">
              <label>{t('profilePhoto')}</label>
              <div className="photo-upload">
                {photo ? (
                  <img src={photo} alt="preview" className="avatar" />
                ) : (
                  <div className="avatar">{name.charAt(0).toUpperCase() || '?'}</div>
                )}
                <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                  {t('changePhoto')}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} hidden />
                </label>
                {photo && (
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPhoto(null)}>
                    {t('removePhoto')}
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>{t('fullName')}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="form-group">
              <label>{t('email')}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
              <button type="submit" className="btn btn-primary">
                {t('saveChanges')}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                {t('cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
