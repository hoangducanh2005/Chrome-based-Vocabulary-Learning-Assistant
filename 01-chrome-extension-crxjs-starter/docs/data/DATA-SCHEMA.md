# DATA-SCHEMA — Storage Schema

## 1. Purpose
This document defines the exact TypeScript interfaces and default states for `chrome.storage.local` and `chrome.storage.sync`. It serves as the single source of truth for the database schema to ensure data consistency across all features and prevent the introduction of undocumented fields.

## 2. `chrome.storage.local` (Application Data)
Used for storing large, machine-specific datasets like vocabulary lists and analytics.

### Complete Schema Definition
```typescript
interface LocalStorageSchema {
  schema_version: number;
  vocab_list: VocabItem[];
  daily_stats: Record<string, DailyStat>; // Keyed by YYYY-MM-DD
  reading_history: Record<string, ReadingMetric>; // Keyed by URL
}
```

### Field Definitions & Defaults

* **`schema_version`**
  * **Type:** `number`
  * **Default:** `1`
  * **Purpose:** Tracks the current database structure for migration scripts.

* **`vocab_list`**
  * **Type:** `Array<VocabItem>`
  * **Default:** `[]`
  * **Purpose:** The user's saved flashcard deck.
  * **Structure:**
    ```typescript
    interface VocabItem {
      id: string;              // UUID v4
      word: string;            // The highlighted text
      translation: string;     // The translated text
      contextSentence: string; // Surrounding sentence
      sourceUrl: string;       // Where it was found
      createdAt: number;       // Unix timestamp (ms)
      nextReviewAt: number;    // Unix timestamp (ms) for basic SRS
      status: "learning" | "known"; 
    }
    ```

* **`daily_stats`**
  * **Type:** `Record<string, DailyStat>`
  * **Default:** `{}`
  * **Purpose:** Powers the statistics chart. Keyed by local date string (e.g., `"2026-06-15"`).
  * **Structure:**
    ```typescript
    interface DailyStat {
      lookedUpCount: number;
      savedCount: number;
      reviewedCount: number;
    }
    ```

* **`reading_history`**
  * **Type:** `Record<string, ReadingMetric>`
  * **Default:** `{}`
  * **Purpose:** Tracks time spent and scroll depth per URL.
  * **Structure:**
    ```typescript
    interface ReadingMetric {
      timeSpentSeconds: number;
      scrollDepthPercentage: number;
      lastVisited: number; // Unix timestamp
    }
    ```

## 3. `chrome.storage.sync` (User Preferences)

Used for lightweight settings that should sync across the user's logged-in Chrome browsers.

### Complete Schema Definition

```typescript
interface SyncStorageSchema {
  settings: UserSettings;
}
```

### Field Definitions & Defaults

* **`settings`**
  * **Type:** `UserSettings`
  * **Default:**
    ```json
    {
      "targetLanguage": "en",
      "nativeLanguage": "es",
      "theme": "system",
      "tooltipPosition": "floating",
      "enableAiSummarization": false
    }
    ```
  * **Purpose:** Global preferences controlling UI and API behavior.
  * **Structure:**
    ```typescript
    interface UserSettings {
      targetLanguage: string;  // ISO 639-1 code (e.g., 'es', 'ja')
      nativeLanguage: string;  // ISO 639-1 code
      theme: "light" | "dark" | "system";
      tooltipPosition: "floating" | "fixed-bottom";
      enableAiSummarization: boolean; // Toggles AI context menu/features
    }
    ```

## 4. Migration Notes

Because Chrome extension updates happen automatically in the background, we must safely migrate existing user data if the schema changes in future versions (e.g., v2).

* **Migration Strategy:**
  * The Background Script (`src/core/background.ts`) listens to the `chrome.runtime.onInstalled` event.
  * It checks the `schema_version` in `chrome.storage.local`.
  * If `current_version < target_version`, it runs sequential migration scripts.

* **Backward Compatibility Rules:**
  * **Never delete fields aggressively:** If a field is deprecated, mark it as optional (`?: type`) rather than removing it completely to prevent data loss on rollback.
  * **Provide sensible fallbacks:** If a new required field is added to `VocabItem` in v2, the migration script must loop through `vocab_list` and apply a default value to all existing items.

### Concrete Migration Example

```typescript
// src/core/migrations.ts

export async function runMigrations() {
  const data = await chrome.storage.local.get(["schema_version", "vocab_list"]);
  let currentVersion = data.schema_version || 1;

  if (currentVersion === 1) {
    // Example: V2 requires a 'status' field on vocab items that didn't exist in V1
    const updatedVocabList = (data.vocab_list || []).map(item => ({
      ...item,
      status: item.status || "learning" // Fallback application
    }));

    await chrome.storage.local.set({
      schema_version: 2,
      vocab_list: updatedVocabList
    });
    console.log("Migrated to DB Schema V2");
  }
}
```