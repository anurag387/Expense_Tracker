import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { categoryName } from '../hooks/useCategories.js';
import { dictionaries } from '../i18n/index.js';

const ICONS = ['🍔', '🛒', '🚌', '🛍️', '🧾', '💊', '🎬', '💼', '📦', '🏠', '🎓', '✈️', '🐾', '🎁'];
const COLORS = ['#16a8ff', '#43f0a7', '#ff6f86', '#ffd84d', '#8d7cff', '#ff9f5a', '#5ad1ff', '#c084fc'];

export default function CategoryModal({ open, onClose, onSubmit, initial }) {
  const { t, lang } = useLanguage();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (initial) {
        setName(categoryName(initial, dictionaries, lang));
        setIcon(initial.icon || ICONS[0]);
        setColor(initial.color || COLORS[0]);
      } else {
        setName('');
        setIcon(ICONS[0]);
        setColor(COLORS[0]);
      }
    }
  }, [open, initial]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('requiredField'));
      return;
    }
    onSubmit({ name: name.trim(), icon, color });
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: 380 }}>
        <div className="modal-header">
          <div className="section-title">{initial ? t('editCategory') : t('addCategory')}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('categoryName')}</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            {error && <div className="form-error">{error}</div>}
          </div>

          <div className="form-group">
            <label>{t('icon')}</label>
            <div className="icon-grid">
              {ICONS.map((ic) => (
                <button
                  type="button"
                  key={ic}
                  className={`icon-choice${ic === icon ? ' selected' : ''}`}
                  onClick={() => setIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>{t('color')}</label>
            <div className="color-grid">
              {COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`color-swatch${c === color ? ' selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('cancel')}
            </button>
            <button type="submit" className="btn btn-primary">
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
