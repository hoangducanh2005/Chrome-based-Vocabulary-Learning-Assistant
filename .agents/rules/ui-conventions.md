---
trigger: model_decision
---

# UI Conventions — applies to EVERY component in this project

Read this file before writing any component, hook, or style.

---

## Colors

All colors come from CSS custom properties defined in `src/shared/styles/tokens.css`.
**Never** use raw Tailwind color classes (`bg-white`, `text-gray-900`, etc.) or raw hex values.
**Always** use `bg-[var(--variable)]` / `text-[var(--variable)]` syntax.

| Variable | Purpose |
|---|---|
| `--bg` | Page / shell background |
| `--surface` | Popup / panel background |
| `--surface2` | Card / section background |
| `--surface3` | Input / segmented control background |
| `--text` | Primary text |
| `--text2` | Secondary text |
| `--text3` | Muted / label text |
| `--border` | Subtle border |
| `--border2` | Stronger border |
| `--accent` | Primary purple (buttons, active state) |
| `--accent2` | Accent text / icon |
| `--accent-bg` | Accent with opacity (badges) |
| `--teal` / `--teal-bg` | Success / "known" status |
| `--amber` / `--amber-bg` | Translation / warning / streak |
| `--red` / `--red-bg` | Danger / delete |

> Full color values (light + dark hex) and CSS setup are in `setup-ui-foundation` skill → Step 1.

---

## i18n

**Never** hardcode UI text. **Always** use `const { t } = useI18n()` from `src/shared/hooks/useI18n.ts`.

All keys live in `public/_locales/en/messages.json` and `public/_locales/vi/messages.json`.
When adding a new key — update **both** files simultaneously.

---

## Pre-output checklist

Before generating any component:
1. All colors use `var(--variable)` — no raw hex, no Tailwind color class?
2. All visible text goes through `t('key')`?
3. Theme toggling goes through `useTheme()`?
4. Language toggling goes through `useI18n()`?
