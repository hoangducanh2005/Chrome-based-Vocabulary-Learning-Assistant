import { Tab } from '@/shared/types/tab';
import { useI18n } from '@/shared/hooks/useI18n';

interface TabNavProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

export const TabNav = ({ activeTab, onChange }: TabNavProps) => {
  const { t } = useI18n();

  const tabs: { id: Tab; labelKey: string; icon: string }[] = [
    { id: 'lookup', labelKey: 'lookupWord', icon: '🔍' },
    { id: 'vocabulary', labelKey: 'wordList', icon: '📚' },
    { id: 'flashcards', labelKey: 'flashcard', icon: '📇' },
    { id: 'stats', labelKey: 'statistics', icon: '📊' },
    { id: 'settings', labelKey: 'settings', icon: '⚙️' },
  ];

  return (
    <nav className="flex items-center bg-[var(--surface)] border-b border-[var(--border)] px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 py-3 text-sm flex flex-col items-center gap-1 border-b-2 transition-colors ${isActive ? 'border-[var(--accent)] text-[var(--accent)] font-semibold' : 'border-transparent text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)]'}`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{t(tab.labelKey)}</span>
          </button>
        );
      })}
    </nav>
  );
};
