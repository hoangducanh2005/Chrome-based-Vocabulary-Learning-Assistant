---
name: write-test
description: >
  Write tests for a feature: unit (service), hook, component, and integration.
  Use when user says "write tests", "add tests", "test this feature",
  "viết test", "kiểm thử", or asks to cover a service, hook, or component with tests.
---

# Skill: write-test

Write tests for a feature in the English Reading Assistant Chrome Extension.

## Before You Start

Read `@docs/PROJECT-RULES.md §8` for testing rules and coverage expectations.

---

## Test Layers

### Unit — `services/`
- File: co-located, same name + `.test.ts` (e.g. `vocabService.test.ts`)
- Cover: all happy paths + all documented error codes (`SCREAMING_SNAKE_CASE`)
- Use test factories from `test/factories/` — never inline hardcoded objects
- Mock `core/browser/storage.ts`, not `chrome.storage` directly

### Hook — `hooks/`
- File: co-located, e.g. `useVocabList.test.ts`
- Use Vitest + `renderHook`
- Cover: idle → loading → success, idle → loading → error
- Test state transitions, not implementation details

### Component — `components/`
- File: co-located, e.g. `VocabularyList.test.tsx`
- Use Vitest + Testing Library
- Cover: renders without crashing, primary user interaction (click, type)
- Do not test styles

### Integration — full feature flow
- File: `src/features/<name>/<name>.integration.test.ts`
- Cover: one primary flow end-to-end (e.g. highlight word → save → appears in list)
- Use MSW handlers from `test/mocks/handlers.ts` for HTTP
- Use chrome mock from `test/mocks/chrome.ts` for Chrome APIs
- Never make real network calls

---

## Rules

- Chrome API mocked globally via `test/mocks/chrome.ts` — never polyfilled
- External HTTP intercepted with MSW — never real network in tests
- Test data built with factories — never inline hardcoded objects
- No `it.skip` or `test.todo` committed — open a GitHub issue instead
