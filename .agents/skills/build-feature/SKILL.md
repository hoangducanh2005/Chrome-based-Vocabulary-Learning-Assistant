---
name: build-feature
description: >
  Build a complete feature from A-Z: scaffold, storage, service, hook, UI,
  and inter-context messaging if needed. Enforces layer boundaries automatically.
  Use when user says "build feature", "create feature", "add screen",
  "xây dựng tính năng", "làm tính năng", "tạo feature", or describes a new feature to implement.
---

# Skill: build-feature

Build a feature end-to-end for the English Reading Assistant Chrome Extension.

## Before You Start

Read `@docs/PRD.md` to understand the feature requirement, v1 scope, and relevant user flows.

---

## Steps (in order)

### 1. Scaffold
Create `src/features/<feature-name>/` with:
```
components/     ← UI components for this feature only
hooks/          ← React hooks
services/       ← Pure business logic (no React, no chrome.*)
types.ts        ← Feature-scoped TypeScript types
index.ts        ← Public API — only export what other layers need
```

### 2. Types
Define all types in `types.ts` first. Use `Result<T>` for fallible operations, `AsyncState<T>` for UI state. No `any`, no `T | null`.

### 3. Storage (if needed)
- Add storage key constants to `core/browser/storage.ts` (`STORAGE_KEYS`)
- Create a service in `services/` that calls `core/browser/storage.ts` — never call `chrome.storage` directly
- After writing `vocab:entries`, run quota check (warn if > 80% of 10MB)

### 4. Service
- Pure TypeScript — no React, no `chrome.*`
- Accept external clients (translation, AI) via constructor injection, not direct imports
- Return `Result<T>` from all fallible functions
- Error strings in `SCREAMING_SNAKE_CASE`

### 5. Hook
- Connect service to React state using `AsyncState<T>`
- Handle: idle → loading → success / error transitions
- Never call `chrome.*` or `sendMessage` directly — call the service

### 6. UI Component
- One component per file, named `PascalCase.tsx`
- Tailwind only — no inline styles
- Props interface named `<ComponentName>Props` in same file
- Components call hooks only — never services or chrome APIs directly
- If this component renders on word highlight: must be within 300ms

### 7. Message (only if cross-context needed)
If the feature requires communication between popup ↔ background ↔ content script:
- Add message type + payload interface to `core/messaging/types.ts`
- Register handler in `background/index.ts` (wrap in try/catch, return `Result`)
- Document in `@docs/data/API-CONTRACTS.md`
- Content script never talks directly to popup — always goes through background

### 8. Export
Update `index.ts` to export only the public API. Internal services and sub-components stay private.

---

## Rules — Never Violate

- No cross-feature imports (`features/A` importing from `features/B`)
- No `chrome.*` calls outside `core/browser/`
- No business logic in entry points (`popup/App.tsx`, `content/main.tsx`, `background/index.ts`)
- No v2 features: no spaced repetition, no cloud sync, no auth, no audio TTS
- No `any` types
- No `it.skip` or `test.todo`