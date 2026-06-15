import { Language } from '@/core/browser/i18n';

let messages: Record<Language, Record<string, { message: string }>> = {
  en: {},
  vi: {},
};

export const initI18n = async () => {
  try {
    const [en, vi] = await Promise.all([
      fetch(chrome.runtime.getURL('_locales/en/messages.json')).then(res => res.json()),
      fetch(chrome.runtime.getURL('_locales/vi/messages.json')).then(res => res.json())
    ]);
    messages.en = en;
    messages.vi = vi;
  } catch (err) {
    console.error('Error loading locales', err);
  }
};

export const createT = (lang: Language) => {
  return (key: string): string => {
    const entry = messages[lang]?.[key];
    return entry && entry.message ? entry.message : key;
  };
};
