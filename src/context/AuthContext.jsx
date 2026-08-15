import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, getToken, setToken, setUnauthorizedHandler } from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // On load, if we have a saved token, ask the backend who we are. This
  // replaces the old "read session id from localStorage" check.
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      const token = getToken();
      if (!token) {
        setReady(true);
        return;
      }
      try {
        const { user: me } = await api.get('/auth/me');
        if (active) setUser(me);
      } catch {
        setToken(null);
      } finally {
        if (active) setReady(true);
      }
    }

    bootstrap();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    // If any API call comes back 401 (expired/invalid token), log out
    // cleanly instead of leaving the UI in a broken half-authed state.
    setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
    return () => setUnauthorizedHandler(null);
  }, []);

  async function register({ name, email, password, photo }) {
    try {
      const { token, user: newUser } = await api.postPublic('/auth/register', {
        name,
        email,
        password,
        photo,
      });
      setToken(token);
      setUser(newUser);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function login({ email, password }) {
    try {
      const { token, user: found } = await api.postPublic('/auth/login', { email, password });
      setToken(token);
      setUser(found);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  async function updateProfile(partial) {
    try {
      const { user: updated } = await api.put('/auth/profile', partial);
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function changePassword({ currentPassword, newPassword }) {
    try {
      await api.put('/auth/password', { currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async function requestPasswordReset(email) {
    try {
      const data = await api.postPublic('/auth/forgot-password', { email });
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
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
