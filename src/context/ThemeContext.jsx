import React, { createContext, useContext, useEffect, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';

const THEME_KEY = 'etrack_theme';
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readJSON(THEME_KEY, 'dark'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    writeJSON(THEME_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
