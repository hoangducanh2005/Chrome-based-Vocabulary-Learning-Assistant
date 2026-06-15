import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/core/browser/storage';

export type Theme = 'light' | 'dark';

interface Settings {
  theme?: Theme;
  language?: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS);
      if (settings?.theme) {
        setTheme(settings.theme);
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    const settings = await storage.get<Settings>(STORAGE_KEYS.SETTINGS) || {};
    await storage.set(STORAGE_KEYS.SETTINGS, { ...settings, theme: newTheme });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
