---
name: setup-ui-foundation
description: >
  Setup shared UI foundation: dark/light theme, i18n (EN/VI), shared layout components
  (Header + TabNav + Footer), and popup shell. Run once before building any feature.
  Use when user says "setup UI", "setup theme", "setup i18n", "setup layout",
  "thiết lập giao diện", "cài theme", "cài i18n", "tạo layout", "setup foundation".
---

# Skill: setup-ui-foundation

Setup the complete UI foundation for the English Reading Assistant Chrome Extension.
Run this skill **once only** before building any feature.

## Before You Start

Read the following files to understand the project:
- `@docs/ARCHITECTURE.md` — layer structure, folder conventions
- `@docs/PROJECT-RULES.md` — coding rules, section 10 (Theme) and section 11 (i18n)
- `@.agents/rules/ui-conventions.md` — color pairs, i18n key table, pre-output checklist
- `public/_locales/en/messages.json` — existing i18n keys
- `public/_locales/vi/messages.json` — Vietnamese translations

---

## Step 1 — Color Tokens + Tailwind Dark Mode

Create `src/shared/styles/tokens.css` — the single source of truth for all colors.
Both light (`:root`) and dark (`.dark`) palettes are extracted from the design file `docs/ui/English Reading Assistant.html`.

```css
:root {
  --bg: #f0f2f8;
  --surface: #ffffff;
  --surface2: #f5f6fb;
  --surface3: #eaecf5;
  --border: rgba(0,0,0,0.07);
  --border2: rgba(0,0,0,0.12);
  --accent: #6254e8;
  --accent2: #8072ef;
  --accent-bg: rgba(98,84,232,0.08);
  --teal: #1aaa88;
  --teal-bg: rgba(26,170,136,0.08);
  --amber: #d4960a;
  --amber-bg: rgba(212,150,10,0.10);
  --red: #d94f4f;
  --red-bg: rgba(217,79,79,0.08);
  --text: #1a1d2e;
  --text2: #5a5f7a;
  --text3: #a0a5c0;
}

.dark {
  --bg: #0e1018;
  --surface: #161822;
  --surface2: #1e2130;
  --surface3: #262a3e;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --accent: #7c6ef7;
  --accent2: #a99ff9;
  --accent-bg: rgba(124,110,247,0.12);
  --teal: #2dd4ac;
  --teal-bg: rgba(45,212,172,0.10);
  --amber: #f5b944;
  --amber-bg: rgba(245,185,68,0.12);
  --red: #f26d6d;
  --red-bg: rgba(242,109,109,0.10);
  --text: #e6e8f0;
  --text2: #8b90a8;
  --text3: #555a72;
}
```

Then import tokens into every CSS entry point and enable Tailwind dark mode:

```css
/* src/popup/index.css */
@import "tailwindcss";
@import "@/shared/styles/tokens.css";
@variant dark (&:where(.dark, .dark *));

/* src/sidepanel/index.css */
@import "tailwindcss";
@import "@/shared/styles/tokens.css";
@variant dark (&:where(.dark, .dark *));

/* src/content/views/App.css */
@import "@/shared/styles/tokens.css";
@variant dark (&:where(.dark, .dark *));
```

> Tailwind CSS v4 configures dark mode in CSS, not in a config file.
> Variables switch automatically — components never need `dark:` prefix when using `var(--)`.

**Verify:** `src/shared/styles/tokens.css` exists. All 3 entry point CSS files import it.

---

## Step 2 — Theme Context

Create `src/shared/context/ThemeContext.tsx`:

- Type: `Theme = 'light' | 'dark'`
- Create `ThemeContext` with `createContext`
- `ThemeProvider`: holds state, reads storage on mount, toggles `document.documentElement` class
  - On mount: read from `chrome.storage.local` via `core/browser/storage.ts` using key `STORAGE_KEYS.SETTINGS`
  - If no saved value: fallback to `window.matchMedia('(prefers-color-scheme: dark)')` → `'dark'` or `'light'`
  - On every theme change: toggle class `'dark'` on `document.documentElement`
  - On user toggle: save the preference back to storage
- `useTheme()`: reads from context, throws if used outside `ThemeProvider`
- Export: `ThemeProvider`, `useTheme`, `Theme`

Then create `src/shared/hooks/useTheme.ts` as a re-export only:
```typescript
export { useTheme } from '@/shared/context/ThemeContext';
```

**Rules:**
- Never call `chrome.storage` directly — use `core/browser/storage.ts`
- No `any` types
- All components must use `useTheme()` from the hook path `@/shared/hooks/useTheme`

**Verify:** `ThemeProvider` is exported from `ThemeContext.tsx`. `useTheme` re-exported from `useTheme.ts`.

---

## Step 3 — i18n Core

Create `src/core/browser/i18n.ts`:

- Type: `Language = 'en' | 'vi'`
- `getLanguage(): Promise<Language>`
  - Read from `chrome.storage.local` via `core/browser/storage.ts` (key `STORAGE_KEYS.SETTINGS`) first
  - If no saved value: read `chrome.i18n.getUILanguage()` as the init value
  - Map: locale starting with `'vi'` → `'vi'`, anything else → `'en'`
- `setLanguage(lang: Language): Promise<void>`
  - Save to storage via `core/browser/storage.ts`

**Rules:**
- Never call `chrome.storage` directly
- Explicit return types, no `any`

---

## Step 4 — i18n Translation Helper

Create `src/shared/i18n/index.ts`:

- Import `public/_locales/en/messages.json` as `enMessages`
- Import `public/_locales/vi/messages.json` as `viMessages`
- Export `createT(lang: Language): (key: string) => string`
  - Returns a function `t(key)` that reads `messages[lang][key].message`
  - If the key does not exist or message is empty: return `key` (prevents blank UI)

> Chrome `_locales` format: `{ "saveWord": { "message": "Save word" } }`

---

## Step 5 — i18n Context

Create `src/shared/context/I18nContext.tsx`:

- Import `getLanguage`, `setLanguage`, `Language` from `core/browser/i18n`
- Import `createT` from `shared/i18n/index`
- Create `I18nContext` with `createContext`
- `I18nProvider`: holds `language` state, loads translations, exposes `t` and `toggleLanguage`
  - `useEffect`: call `getLanguage()` on mount → set into state
  - `toggleLanguage()`: switch `'en'` ↔ `'vi'`, call `setLanguage()`, update state
  - `t` = `createT(language)` — recomputed whenever language changes (use `useMemo`)
- `useI18n()`: reads from context, throws if used outside `I18nProvider`
- Export: `I18nProvider`, `useI18n`

Then create `src/shared/hooks/useI18n.ts` as a re-export only:
```typescript
export { useI18n } from '@/shared/context/I18nContext';
```

**Rules:**
- All components must use `useI18n()` from the hook path `@/shared/hooks/useI18n`
- No `any` types

**Verify:** `I18nProvider` exported from `I18nContext.tsx`. `useI18n` re-exported from `useI18n.ts`. Hook exports exactly `{ t, language, toggleLanguage }`.

---

## Step 6 — Header Component

Create `src/shared/components/Header.tsx`:

Layout (left to right): logo icon + app name — language badge + theme toggle button.

- Logo: purple square icon + text `"Reading Assistant"` (hardcoded — app name is not translated)
- Right side: language badge showing current language (`"EN"` or `"VI"`), click calls `toggleLanguage()`
- Right side: sun/moon icon button, click calls `toggleTheme()`
- Use `useI18n()` to get `language` + `toggleLanguage`
- Use `useTheme()` to get `theme` + `toggleTheme`

**Rules:**
- Tailwind only — no inline styles
- All colors must use light/dark pairs (see `@.agents/rules/ui-conventions.md`)
- Props interface named `HeaderProps` if props are needed — defined in the same file
- No business logic

---

## Step 7 — TabNav Component

Create `src/shared/types/tab.ts`:
```typescript
export type Tab = 'lookup' | 'vocabulary' | 'flashcards' | 'stats' | 'settings'
```

Create `src/shared/components/TabNav.tsx`:

- 5 tabs in order: `lookup`, `vocabulary`, `flashcards`, `stats`, `settings`
- Each tab: icon from `lucide-react` + label from `t()`:
  - lookup → `t('lookupWord')`
  - vocabulary → `t('wordList')`
  - flashcards → `t('flashcard')`
  - stats → `t('statistics')`
  - settings → `t('settings')`
- Active tab: purple underline, icon + text bolder
- Props:
  ```typescript
  interface TabNavProps {
    activeTab: Tab
    onChange: (tab: Tab) => void
  }
  ```
- Use `useI18n()` inside the component to get `t`

**Rules:**
- Tailwind only, light/dark pairs for every color
- One component per file
- No `chrome.*` calls

---

## Step 8 — Footer Component

Create `src/shared/components/Footer.tsx`:

- Display copyright text: `© {currentYear} Hỏi Dân IT`
- Display handle: `@hoidanit`
- Link `@hoidanit` to `https://hoidanit.vn` (open in new tab via `target="_blank" rel="noreferrer"`)
- `currentYear` computed with `new Date().getFullYear()` — never hardcoded
- No props needed

**Rules:**
- Tailwind only, light/dark pairs:
  - Text: `text-gray-400 dark:text-gray-500`
  - Link hover: `hover:text-purple-600 dark:hover:text-purple-400`
- No i18n needed for this component — copyright text stays in English/mixed

---

## Step 9 — Popup Entry Point + App Shell

Update `src/popup/main.tsx` — wrap the app with both providers at the root:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/shared/context/ThemeContext'
import { I18nProvider } from '@/shared/context/I18nContext'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
```

Update `src/popup/App.tsx`:

- `useState<Tab>('lookup')` to track the active tab
- Call `useTheme()` → apply class `'dark'` on the root `<div>` when theme is dark
- Render layout:
  ```
  <div root with conditional 'dark' class>
    <Header />
    <TabNav activeTab={...} onChange={...} />
    <main>
      {activeTab === 'lookup'     && <LookupPlaceholder />}
      {activeTab === 'vocabulary' && <VocabularyPlaceholder />}
      {activeTab === 'flashcards' && <FlashcardsPlaceholder />}
      {activeTab === 'stats'      && <StatsPlaceholder />}
      {activeTab === 'settings'   && <SettingsPlaceholder />}
    </main>
    <Footer />
  </div>
  ```
- Create temporary placeholder components, each in the correct feature folder:
  - `src/features/translation/components/LookupPlaceholder.tsx`
  - `src/features/vocabulary/components/VocabularyPlaceholder.tsx`
  - `src/features/flashcards/components/FlashcardsPlaceholder.tsx`
  - `src/features/stats/components/StatsPlaceholder.tsx`
  - `src/features/settings/components/SettingsPlaceholder.tsx`
- Each placeholder renders: `<div className="p-4 text-center text-gray-400 dark:text-gray-500">Coming soon...</div>`

**Rules:**
- Providers live in `main.tsx` only — never nest them inside `App.tsx`
- `popup/App.tsx` is a shell only — no business logic
- Do not import directly from feature internals — use `features/<name>/index.ts`

---

## Completion Checklist

- [ ] `src/popup/index.css` has `@variant dark`
- [ ] `src/shared/context/ThemeContext.tsx` exists, exports `ThemeProvider` + `useTheme`
- [ ] `src/shared/hooks/useTheme.ts` re-exports `useTheme` from `ThemeContext`
- [ ] `src/core/browser/i18n.ts` exists, exports `getLanguage`, `setLanguage`
- [ ] `src/shared/i18n/index.ts` exists, exports `createT`
- [ ] `src/shared/context/I18nContext.tsx` exists, exports `I18nProvider` + `useI18n`
- [ ] `src/shared/hooks/useI18n.ts` re-exports `useI18n` from `I18nContext`
- [ ] `src/popup/main.tsx` wraps app with `<ThemeProvider><I18nProvider>`
- [ ] `src/shared/components/Header.tsx` renders correctly with theme + language toggles
- [ ] `src/shared/types/tab.ts` has type `Tab`
- [ ] `src/shared/components/TabNav.tsx` renders 5 tabs, highlights active tab
- [ ] `src/shared/components/Footer.tsx` renders copyright + `@hoidanit` link
- [ ] `src/popup/App.tsx` is a shell — composes Header + TabNav + placeholders + Footer
- [ ] `npm run dev` produces no TypeScript errors
- [ ] Clicking theme toggle: UI switches light ↔ dark
- [ ] Clicking language badge: tab labels switch EN ↔ VI

---

## Hard Rules — Never Violate

- Never call `chrome.*` directly outside `core/browser/`
- Never hardcode one-sided color classes — always use `light / dark:` Tailwind pairs
- Never hardcode UI text strings — always use `t('key')` from `useI18n()`
- No business logic in `popup/App.tsx`
- No `any` types
