import { useState } from 'react';
import { useTheme } from '@/shared/hooks/useTheme';
import { Tab } from '@/shared/types/tab';
import { Header } from '@/shared/components/Header';
import { TabNav } from '@/shared/components/TabNav';
import { Footer } from '@/shared/components/Footer';

import { LookupPlaceholder } from '@/features/translation';
import { VocabularyPlaceholder } from '@/features/vocabulary';
import { FlashcardsPlaceholder } from '@/features/flashcards';
import { StatsPlaceholder } from '@/features/stats';
import { SettingsPlaceholder } from '@/features/settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('lookup');
  useTheme();

  return (
    <div className="flex flex-col h-[500px] w-[400px] bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <TabNav activeTab={activeTab} onChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'lookup' && <LookupPlaceholder />}
        {activeTab === 'vocabulary' && <VocabularyPlaceholder />}
        {activeTab === 'flashcards' && <FlashcardsPlaceholder />}
        {activeTab === 'stats' && <StatsPlaceholder />}
        {activeTab === 'settings' && <SettingsPlaceholder />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
