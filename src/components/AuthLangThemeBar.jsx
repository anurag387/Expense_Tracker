import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function AuthLangThemeBar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useLanguage();

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
      <button className="btn btn-secondary btn-sm" onClick={toggleLang}>
        {lang === 'en' ? 'বাংলা' : 'EN'}
      </button>
      <button className="btn btn-secondary btn-sm" onClick={toggleTheme}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </div>
  );
}
