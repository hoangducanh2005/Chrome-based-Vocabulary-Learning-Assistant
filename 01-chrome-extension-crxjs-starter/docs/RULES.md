# PROJECT-RULES

## 1. Purpose
This document establishes strict security, architectural, and coding guardrails. All developers and AI coding assistants **must** adhere to these rules when contributing to the `Chrome-based-Vocabulary-Learning-Assistant` project to ensure security, maintainability, and Manifest V3 (MV3) compliance.

## 2. Security Rules (Strict)
* **DO NOT use `innerHTML` or `dangerouslySetInnerHTML`.** 
  * *Why:* Prevents Cross-Site Scripting (XSS) vulnerabilities, especially when rendering user-highlighted text or external dictionary API responses.
  * *Good:* `<div className="translation">{translationText}</div>`
  * *Bad:* `<div dangerouslySetInnerHTML={{ __html: translationText }} />`
* **DO NOT use `eval()`, `setTimeout(string)`, or `setInterval(string)`.**
  * *Why:* Manifest V3 strictly enforces a Content Security Policy (CSP) that prohibits arbitrary string execution.
* **Sanitize External Data:** Treat all text extracted from the DOM (e.g., `window.getSelection().toString()`) and external API responses as untrusted.

## 3. Manifest V3 (MV3) Rules
* **No Deprecated MV2 APIs:**
  * *Bad:* `chrome.browserAction`, `chrome.extension.getBackgroundPage()`
  * *Good:* `chrome.action`, Service Worker message passing via `chrome.runtime.sendMessage()`
* **Ephemeral Background Scripts:** 
  * The Service Worker (`background.ts`) can be terminated by Chrome at any time. **Do not use global variables to store state.**
  * *Bad:* `let activeWord = "test";` (Will reset when the worker sleeps)
  * *Good:* Save state immediately to `chrome.storage.local`.
* **No DOM Access in Background:** The Service Worker does not have access to `window` or `document`. If DOM manipulation or parsing is needed, do it in the Content Script or use `Offscreen API` (if strictly necessary).

## 4. Coding Rules
* **TypeScript Strictness:**
  * **No `any` allowed.** Use `unknown` if the shape is truly unpredictable, and narrow it with type guards.
  * Define explicit return types for all functions and React components.
* **React Components:**
  * **No Class Components.** Use Functional Components and Hooks exclusively.
  * *Example:* Use `React.FC<Props>` or standard function declarations returning `JSX.Element`.
* **Styling:**
  * Use CSS Modules or Tailwind CSS (depending on setup choice) to prevent CSS leakage in the Content Script. 
  * Content scripts must inject UI within a Shadow DOM to isolate extension styles from the host page's CSS.

## 5. New File Creation Rules
* **Follow `ARCHITECTURE.md` Strict Feature-Based Structure.**
  * Do not create global `/components` or `/hooks` folders.
  * If a component or hook is specific to flashcards, it belongs in `src/features/flashcards/`.
  * If it is genuinely shared across multiple features (e.g., a generic Button or UI modal), it belongs in `src/shared/components/`.
* **Naming Conventions:**
  * Files exporting React components: PascalCase (e.g., `FlashcardDeck.tsx`).
  * Files exporting utilities/hooks: camelCase (e.g., `useTranslation.ts`).
  * Types and interfaces: Prefix/Suffix appropriately or keep in a `types.ts` file within the feature folder.

## 6. Message Type Extension Rules
* **No Ad-Hoc Messaging:** You cannot invent new message types inside component code.
* **Process for New Messages:**
  1. Any new cross-component message (e.g., adding an AI Summarization trigger) **must first** be documented and approved in `API-CONTRACTS.md`.
  2. The payload structure, expected response, and error codes must be defined in the global `MessageType` enum and interface definitions.
  3. Only after the contract is updated can the AI/developer implement the `chrome.runtime.sendMessage` and background listener.