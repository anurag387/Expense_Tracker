import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage.js';
import { dictionaries } from '../i18n/index.js';

const LANG_KEY = 'etrack_lang';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => readJSON(LANG_KEY, 'en'));

  useEffect(() => {
    writeJSON(LANG_KEY, lang);
    document.body.setAttribute('lang', lang);
  }, [lang]);

  function toggleLang() {
    setLang((prev) => (prev === 'en' ? 'bn' : 'en'));
  }

  const t = useMemo(() => {
    const dict = dictionaries[lang] || dictionaries.en;
    return (key) => dict[key] ?? dictionaries.en[key] ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
