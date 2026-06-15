import { useTheme } from '@/shared/hooks/useTheme';
import { useI18n } from '@/shared/hooks/useI18n';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useI18n();

  return (
    <header className="flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--accent)] rounded flex items-center justify-center text-white font-bold">
          R
        </div>
        <h1 className="text-lg font-bold text-[var(--text)]">Reading Assistant</h1>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleLanguage}
          className="px-2 py-1 text-xs font-semibold rounded bg-[var(--surface3)] text-[var(--text2)] hover:bg-[var(--border)]"
        >
          {language.toUpperCase()}
        </button>
        <button 
          onClick={toggleTheme}
          className="p-2 rounded hover:bg-[var(--surface3)] text-[var(--text2)]"
          aria-label="Toggle Theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};
