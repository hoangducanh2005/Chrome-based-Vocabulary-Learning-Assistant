# PRD - Product Requirements Document

## 1. Problem Statement
Language learners frequently experience interrupted reading flow when consuming foreign language content online. They are forced to switch tabs to translate unfamiliar words. Furthermore, they lack an integrated, frictionless mechanism to capture these words alongside their original context, leading to poor vocabulary retention and fragmented learning workflows.

## 2. Core Features (MVP)
* **Instant In-Page Translation:** * Highlight a word/phrase -> display a lightweight, non-blocking tooltip with the translation.
  * *Example:* User highlights "ubiquitous" -> Tooltip shows "present, appearing, or found everywhere."
* **Contextual Vocabulary Saving:**
  * One-click save from the translation tooltip.
  * Automatically captures the highlighted word, translation, source URL, and the surrounding sentence.
  * *Example Saved Object:* `{ word: "ubiquitous", translation: "...", context: "Smartphones have become ubiquitous in daily life.", url: "https://example.com/tech-article" }`
* **Flashcard Review Module:**
  * Accessible via the extension popup action.
  * Simple flashcard UI showing the word and contextual sentence, flipping to reveal the translation.
* **Daily Statistics Dashboard:**
  * Visual counters in the extension popup.
  * *Metrics:* "Words Saved Today", "Words Reviewed Today", "Current Streak".
* **AI-Powered Passage Summarization (Optional/On-Demand):**
  * Context menu option (right-click) or button in the popup to summarize highlighted long text passages using an external AI API (e.g., OpenAI/Gemini).
  * *Example:* Highlight 3 paragraphs -> Right-click "Summarize" -> Popup displays a 3-bullet point summary.

## 3. Out of Scope (v1)
* **Cloud Syncing & Cross-Device Support:** Data will rely exclusively on Chrome Local/Sync Storage for MVP. A dedicated backend database is excluded.
* **Complex Spaced Repetition Algorithms (SRS):** MVP will use a basic "Review Due" queue rather than full-scale Anki-style algorithms (SM-2).
* **Export functionality:** Exporting vocabulary to CSV or Anki will be deferred to v2.
* **Gamification & Leaderboards:** Badges, friends lists, and social sharing are excluded.
* **Mobile App Counterpart:** Strictly confined to the desktop Chrome browser environment.

## 4. Main User Flow
1. **Onboarding:** User installs the extension. Extension requests necessary permissions (activeTab, storage, contextMenus).
2. **Discovery & Translation:** * User navigates to an article (e.g., a Spanish news site).
   * User highlights an unknown word.
   * A small UI tooltip dynamically renders near the cursor with the translated text.
3. **Capture:**
   * User clicks the "Save to Deck" button inside the tooltip.
   * The system silently saves the payload (word, translation, surrounding text, URL) to Chrome Storage.
4. **Summarization (Alternative Flow):**
   * User highlights a long passage -> Right-clicks -> Selects "Summarize Passage".
   * A side-panel or modal injects over the page displaying the AI-generated bulleted summary.
5. **Review & Reinforcement:**
   * User clicks the extension icon in the Chrome toolbar to open the main popup.
   * User selects the "Flashcards" tab.
   * User reviews saved words, clicking to flip the card and self-grading (e.g., "Knew it" / "Didn't know it").
6. **Analytics:**
   * User navigates to the "Stats" tab in the popup to view their daily progress and streak count.