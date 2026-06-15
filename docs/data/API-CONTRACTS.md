# API-CONTRACTS — Message Passing

## 1. Purpose
In Manifest V3, components (Content Scripts, Popup, Background) run in isolated environments. All communication between them must occur via `chrome.runtime.sendMessage`. This document defines the exact TypeScript contracts for these messages to ensure type safety and consistent error handling across the team.

## 2. Standard Response Format
All message handlers in the Background script must return a standardized response object. This prevents unhandled promise rejections and provides uniform error states to the UI.

```typescript
// src/shared/types/api.ts

export interface SuccessResponse<T = void> {
  success: true;
  data: T;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
}

export type ApiResponse<T = void> = SuccessResponse<T> | ErrorResponse;
```

## 3. Error Handling & Codes

Use a centralized enum for error codes to easily track and debug issues.

```typescript
export enum ErrorCode {
  TRANSLATION_FAILED = "TRANSLATION_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
  STORAGE_QUOTA_EXCEEDED = "STORAGE_QUOTA_EXCEEDED",
  AI_SUMMARIZATION_FAILED = "AI_SUMMARIZATION_FAILED",
  UNAUTHORIZED = "UNAUTHORIZED",
  BAD_REQUEST = "BAD_REQUEST",
}
```

* **Handling Convention:** The receiver (Background) catches all exceptions in a `try/catch` block and always resolves with an `ErrorResponse`. The sender (Content/Popup) checks `if (!response.success)` and displays appropriate UI feedback (e.g., a toast notification).

## 4. Message Types & Contracts

Below is the exhaustive list of message types, their directions, and payload structures.

### 4.1. Translation Requests

* **Direction:** Content Script ➔ Background
* **Purpose:** Fetch the translation for a highlighted word without exposing API keys to the content script.

```typescript
export enum MessageType {
  TRANSLATE_TEXT = "TRANSLATE_TEXT",
}

export interface TranslateMessage {
  type: MessageType.TRANSLATE_TEXT;
  payload: {
    text: string;
    sourceLanguage?: string; // Optional, defaults to auto-detect
    targetLanguage: string;
  };
}

// Expected Response: ApiResponse<{ translatedText: string }>
```

### 4.2. Vocabulary Storage

* **Direction:** Content Script (Tooltip) ➔ Background
* **Purpose:** Save a new vocabulary word and its context to `chrome.storage.local`.

```typescript
export enum MessageType {
  SAVE_VOCAB = "SAVE_VOCAB",
}

export interface SaveVocabMessage {
  type: MessageType.SAVE_VOCAB;
  payload: {
    word: string;
    translation: string;
    contextSentence: string;
    sourceUrl: string;
  };
}

// Expected Response: ApiResponse<void>
```

### 4.3. Reading Metrics

* **Direction:** Content Script ➔ Background
* **Purpose:** Periodically sync the user's reading time and scroll progress on the current page.

```typescript
export enum MessageType {
  SYNC_READING_METRICS = "SYNC_READING_METRICS",
}

export interface SyncReadingMetricsMessage {
  type: MessageType.SYNC_READING_METRICS;
  payload: {
    url: string;
    timeSpentSeconds: number;
    scrollDepthPercentage: number;
  };
}

// Expected Response: ApiResponse<void>
```

### 4.4. AI Summarization (Optional Feature)

* **Direction:** Content Script (Context Menu/Tooltip) ➔ Background
* **Purpose:** Send a long text passage to the background worker to be summarized by an external LLM API.

```typescript
export enum MessageType {
  SUMMARIZE_PASSAGE = "SUMMARIZE_PASSAGE",
}

export interface SummarizePassageMessage {
  type: MessageType.SUMMARIZE_PASSAGE;
  payload: {
    text: string;
  };
}

// Expected Response: ApiResponse<{ summaryPoints: string[] }>
```

## 5. Implementation Example

**Sender (Content Script):**

```typescript
const response = await chrome.runtime.sendMessage<
  SaveVocabMessage, 
  ApiResponse<void>
>({
  type: MessageType.SAVE_VOCAB,
  payload: {
    word: "Ubiquitous",
    translation: "Present everywhere",
    contextSentence: "Smartphones are ubiquitous.",
    sourceUrl: window.location.href
  }
});

if (!response.success) {
  toast.error(`Failed to save: ${response.error.message}`);
} else {
  toast.success("Saved to deck!");
}
```

**Receiver (Background Script - `messageRouter.ts`):**

```typescript
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MessageType.SAVE_VOCAB) {
    handleSaveVocab(message.payload)
      .then(() => sendResponse({ success: true, data: undefined }))
      .catch((err) => sendResponse({
        success: false,
        error: { code: ErrorCode.STORAGE_QUOTA_EXCEEDED, message: err.message }
      }));
    return true; // Indicates async response
  }
});
```