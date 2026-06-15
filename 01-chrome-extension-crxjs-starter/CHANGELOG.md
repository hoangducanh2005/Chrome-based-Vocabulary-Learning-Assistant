# 6. CHANGELOG.md — Change History

## 1. Purpose
This document tracks the project's current state, completed features, and known issues. All team members and AI assistants must consult this file before writing new code to avoid duplicating completed work or overwriting established architectural decisions.

---

## [Unreleased] / Active Development (v0.1.0 - MVP)

### Active Development Goals
* **Sprint Focus:** Finalize the Content Script UI (Translation Tooltip) and establish the `chrome.storage.local` saving mechanism.
* **Next Up:** Implement the Flashcard review UI in the Popup.

### Completed Features (Ready for Use)
* **Architecture:** Vite + CRXJS scaffolding established.
* **Routing:** Service Worker (`background.ts`) message router is configured with TypeScript contracts (`TRANSLATE_TEXT`, `SAVE_VOCAB`).
* **Storage Wrapper:** Typed wrapper for `chrome.storage.local` implemented in `src/shared/storage/api.ts`.
* **Permissions:** `activeTab`, `storage`, and `contextMenus` added to `manifest.json`.

### Known Issues & Open Bugs
* **Bug [UI-01]:** Translation tooltip occasionally clips off-screen when highlighting words near the bottom edge of the viewport. Needs CSS boundary collision detection.
* **Bug [PERF-01]:** `chrome.storage.onChanged` listener in the Popup triggers twice when saving a new word. Needs debounce or deduplication logic.
* **Pending Task:** External Dictionary API is currently using mock data. Needs integration with a real translation endpoint.

---

## [v0.0.1] - 2026-06-15

### Added
* Initial project commit.
* Configured `Vite` with `@crxjs/vite-plugin` for Hot Module Replacement (HMR).
* Added base ESLint and Prettier configurations for strict TypeScript checking.
* Created initial folder structure as defined in `ARCHITECTURE.md`.
* Documented core schemas in `DATA-SCHEMA.md` and `API-CONTRACTS.md`.

### Changed
* N/A - Base initialization.

### Architectural Decisions (ADR)
* **Storage:** Decided against using an external backend (e.g., Supabase/Firebase) for MVP to ensure offline capability and reduce latency. All user data is strictly confined to `chrome.storage.local`.
* **UI Isolation:** Content scripts will inject UI using Web Components (Shadow DOM) to prevent host-page CSS pollution.