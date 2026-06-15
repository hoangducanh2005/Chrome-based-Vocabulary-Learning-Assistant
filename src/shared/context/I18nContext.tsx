import { createContext, useContext, useEffect, useState, useMemo, ReactNode } from 'react';
import { getLanguage, setLanguage, Language } from '@/core/browser/i18n';
import { createT, initI18n } from '@/shared/i18n';

interface I18nContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLangState] = useState<Language>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([getLanguage(), initI18n()]).then(([lang]) => {
      setLangState(lang);
      setReady(true);
    });
  }, []);

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'vi' : 'en';
    setLangState(newLang);
    await setLanguage(newLang);
  };

  const t = useMemo(() => createT(language), [language]);

  if (!ready) return null;

  return (
    <I18nContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
