import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON, uid } from '../utils/storage.js';

const USERS_KEY = 'etrack_users';
const SESSION_KEY = 'etrack_session';

const AuthContext = createContext(null);

function getUsers() {
  return readJSON(USERS_KEY, []);
}
function saveUsers(users) {
  writeJSON(USERS_KEY, users);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sessionId = readJSON(SESSION_KEY, null);
    if (sessionId) {
      const found = getUsers().find((u) => u.id === sessionId);
      if (found) setUser(stripPassword(found));
    }
    setReady(true);
  }, []);

  function stripPassword(u) {
    if (!u) return u;
    const { password, ...rest } = u;
    return rest;
  }

  function register({ name, email, password, photo }) {
    const users = getUsers();
    const emailNormalized = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === emailNormalized)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: uid('user'),
      name: name.trim(),
      email: emailNormalized,
      password, // Note: for a real app, never store plain-text passwords client-side.
      photo: photo || null,
      createdAt: new Date().toISOString(),
    };

    saveUsers([...users, newUser]);
    writeJSON(SESSION_KEY, newUser.id);
    setUser(stripPassword(newUser));
    return { success: true };
  }

  function login({ email, password }) {
    const users = getUsers();
    const emailNormalized = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === emailNormalized);

    if (!found || found.password !== password) {
      return { success: false, message: 'Invalid email or password' };
    }

    writeJSON(SESSION_KEY, found.id);
    setUser(stripPassword(found));
    return { success: true };
  }

  function logout() {
    writeJSON(SESSION_KEY, null);
    setUser(null);
  }

  function updateProfile(partial) {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1) return { success: false, message: 'User not found' };

    const updated = { ...users[idx], ...partial };
    const nextUsers = [...users];
    nextUsers[idx] = updated;
    saveUsers(nextUsers);
    setUser(stripPassword(updated));
    return { success: true };
  }

  function changePassword({ currentPassword, newPassword }) {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx === -1 || users[idx].password !== currentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    const nextUsers = [...users];
    nextUsers[idx] = { ...nextUsers[idx], password: newPassword };
    saveUsers(nextUsers);
    return { success: true };
  }

  function requestPasswordReset(email) {
    const users = getUsers();
    const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    // Frontend-only demo: we can't actually send an email, so we just report
    // whether the account exists. A real backend would email a reset link.
    if (!found) return { success: false, message: 'No account found with that email.' };
    return { success: true, message: 'A password reset link has been sent (demo mode).' };
  }

  const value = {
    user,
    ready,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
