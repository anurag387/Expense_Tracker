import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import useCategories, { categoryName } from '../hooks/useCategories.js';
import useTransactions from '../hooks/useTransactions.js';
import CategoryModal from '../components/CategoryModal.jsx';
import { dictionaries } from '../i18n/index.js';
import { computeCategoryBreakdown } from '../utils/calculations.js';
import { formatCurrency } from '../utils/format.js';

export default function Categories() {
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories(user?.id);
  const { transactions } = useTransactions(user?.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const breakdown = computeCategoryBreakdown(transactions, categories);
  const spendById = Object.fromEntries(breakdown.map((b) => [b.categoryId, b.amount]));

  function handleSubmit(data) {
    if (editing) {
      updateCategory(editing.id, data);
    } else {
      addCategory(data);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete(cat) {
    if (window.confirm(t('confirmDeleteCategory'))) {
      deleteCategory(cat.id);
    }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title">{t('categories')}</div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + {t('addCategory')}
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="emoji">🏷️</div>
            <div>{t('noCategoriesYet')}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: 16,
          }}
        >
          {categories.map((c) => (
            <div className="card" key={c.id} style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div
                  className="list-icon"
                  style={{ background: `${c.color}22`, color: c.color }}
                >
                  {c.icon}
                </div>
                <div className="grow">
                  <div className="title">{categoryName(c, dictionaries, lang)}</div>
                  <div className="meta">{formatCurrency(spendById[c.id] || 0)}</div>
                </div>
              </div>
              <div className="list-actions" style={{ justifyContent: 'flex-end' }}>
                <button
                  className="icon-btn"
                  onClick={() => {
                    setEditing(c);
                    setModalOpen(true);
                  }}
                  title={t('edit')}
                >
                  ✎
                </button>
                <button className="icon-btn" onClick={() => handleDelete(c)} title={t('delete')}>
                  🗑
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </div>
  );
}
