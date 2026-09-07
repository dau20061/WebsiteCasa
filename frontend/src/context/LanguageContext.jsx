import React, { createContext, useContext, useState, useEffect } from 'react';
import { TRANSLATIONS } from '../locales/translations';

const LanguageContext = createContext({
  language: 'vi', // 'vi' | 'zh'
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  isChinese: false
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('casa_language');
      if (saved === 'vi' || saved === 'zh') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'vi';
  });

  const setLanguage = (newLang) => {
    if (newLang !== 'vi' && newLang !== 'zh') return;
    setLanguageState(newLang);
    try {
      localStorage.setItem('casa_language', newLang);
      document.documentElement.lang = newLang === 'zh' ? 'zh-TW' : 'vi';

      // Hỗ trợ tự động dịch toàn trang cho nội dung bài viết dài (Google Translate Cookie)
      if (newLang === 'zh') {
        document.cookie = 'googtrans=/vi/zh-TW; path=/;';
        document.cookie = `googtrans=/vi/zh-TW; domain=${window.location.hostname}; path=/;`;
      } else {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
      }
    } catch (e) {
      console.warn('Lỗi lưu ngôn ngữ:', e);
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-TW' : 'vi';
  }, [language]);

  const t = (key, fallback = '') => {
    if (!key) return fallback;
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.vi;
    const val = currentDict[key];
    if (val !== undefined && val !== null) return val;
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isChinese: language === 'zh'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

