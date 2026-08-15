import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import MobileNav from './MobileNav.jsx';
import TransactionModal from './TransactionModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import useCategories from '../hooks/useCategories.js';
import useAccounts from '../hooks/useAccounts.js';
import useTransactions from '../hooks/useTransactions.js';

export default function AppLayout() {
  const { user } = useAuth();
  const { categories } = useCategories(user?.id);
  const { accounts } = useAccounts(user?.id);
  const { addTransaction } = useTransactions(user?.id);
  const [modalOpen, setModalOpen] = useState(false);

  function openAddModal() {
    setModalOpen(true);
  }

  function handleSubmit(data) {
    addTransaction(data);
    setModalOpen(false);
  }

  return (
    <div className="app-shell">
      <Sidebar onAddNew={openAddModal} />
      <main className="main-content">
        <Outlet context={{ openAddModal }} />
      </main>
      <MobileNav />

      <TransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        categories={categories}
        accounts={accounts}
      />
    </div>
  );
}
