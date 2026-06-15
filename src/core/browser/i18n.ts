import { storage, STORAGE_KEYS } from './storage';

export type Language = 'en' | 'vi';

interface Settings {
  theme?: string;
  language?: Language;
}

export const getLanguage = async (): Promise<Language> => {
  const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS);
  if (settings?.language) {
    return settings.language;
  }
  const uiLang = chrome.i18n.getUILanguage();
  return uiLang.startsWith('vi') ? 'vi' : 'en';
};

export const setLanguage = async (lang: Language): Promise<void> => {
  const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS) || {};
  await storage.set(STORAGE_KEYS.SETTINGS, { ...settings, language: lang });
};
