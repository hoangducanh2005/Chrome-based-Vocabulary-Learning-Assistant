# ARCHITECTURE

## 1. Architectural Principles
* **Feature-Based Organization:** Code is grouped by domain/feature rather than technical type (e.g., `features/translation` instead of grouping all hooks together).
* **Loose Coupling:** Features should not directly import from one another. Shared logic belongs in `src/shared` or `src/core`.
* **Manifest V3 Compliant:** Strict adherence to service worker lifecycles and declarative APIs.
* **Single Source of Truth:** `chrome.storage` is the sole database. Components react to storage changes via listeners, avoiding out-of-sync local state.

## 2. Tech Stack
* **Platform:** Chrome Extension Manifest V3 (MV3)
* **UI Framework:** React (used in Popup and Content Script injected UI)
* **Language:** TypeScript
* **Bundler:** Vite + CRXJS Vite Plugin

## 3. Directory Structure (Feature-Based)
```text
src/
├── core/                   # Global setup, manifest, background entry point
│   ├── background.ts       # Service worker entry
│   └── messageRouter.ts    # Centralized message hub
├── features/               # Feature modules (own UI, logic, types)
│   ├── translation/        # Inline translation & text selection
│   ├── flashcards/         # Flashcard review logic & UI
│   ├── statistics/         # Daily stats & charts
│   └── readingMetrics/     # Reading time & progress bar
├── popup/                  # Popup app entry & layout routing
├── content/                # Content script entry & UI injector
└── shared/                 # Reusable components, utils, storage wrappers
    ├── storage/            # Typed storage wrappers
    └── types/              # Global TypeScript interfaces
```

## 4. Component Boundaries & Responsibilities

### Content Script (src/content)
* Listens for DOM events (text selection, scroll position).
* Injects sandboxed React components (Translation Tooltip, Reading Progress Bar) into the host page.
* Rule: Never calls external APIs or modifies storage directly. Always sends messages to Background.

### Background / Service Worker (src/core/background.ts)
* Acts as the central backend.
* Handles message routing from Content Scripts and Popup.
* Manages direct reads/writes to chrome.storage.
* Calculates daily statistics via background cron/alarms if necessary.

### Popup (src/popup)
* Contains the dashboard UI: Vocabulary list, Flashcards, and Statistics charts.
* Reads from storage on mount and listens for chrome.storage.onChanged.

### Storage API (src/shared/storage)
* Typed wrapper around Chrome's storage API.

## 5. Storage Strategy

### chrome.storage.local (Data & State)
* vocab_list: Array of saved vocabulary objects.
* daily_stats: Object tracking words looked up, saved, and reviewed per date.
* reading_history: Logs of pages read and time spent.

### chrome.storage.sync (User Preferences)
* settings: Target language, UI theme (dark/light), default tooltip position.

## 6. Data Flow Example: Highlighting & Saving a Word

* **User Action:** User highlights text on a webpage.
* **Content Script:** Detects mouseup, extracts text, sends a message TRANSLATE_REQUEST to Background.
* **Background:** Receives message, calls translation dictionary/API, returns translation payload to Content Script.
* **Content UI:** Displays the tooltip with the translated word.
* **User Action:** Clicks "Save" in the tooltip.
* **Content Script:** Sends SAVE_VOCAB_REQUEST to Background.
* **Background:** Appends the word to vocab_list in chrome.storage.local and increments the daily_stats counter.
* **Popup (if open):** Reacts to chrome.storage.onChanged, updating the stats chart and vocab list instantly.

## 7. Message Passing Contract

All cross-component communication must adhere to a strict type definition to prevent runtime errors.

### TypeScript
```typescript
// src/shared/types/messages.ts

export enum MessageType {
  TRANSLATE_REQUEST = "TRANSLATE_REQUEST",
  SAVE_VOCAB = "SAVE_VOCAB",
  UPDATE_READING_PROGRESS = "UPDATE_READING_PROGRESS",
}

export interface TranslateRequestPayload {
  type: MessageType.TRANSLATE_REQUEST;
  payload: {
    text: string;
    contextSentence: string;
    sourceUrl: string;
  };
}

export interface SaveVocabPayload {
  type: MessageType.SAVE_VOCAB;
  payload: {
    word: string;
    translation: string;
    context: string;
    url: string;
    timestamp: number;
  };
}

export type ExtensionMessage = TranslateRequestPayload | SaveVocabPayload;
```