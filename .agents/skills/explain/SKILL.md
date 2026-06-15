---
name: explain
description: >
  Explain code, concepts, flow, or decisions for beginners.
  Use when user says "explain", "giải thích", "how does this work",
  "what is", "tại sao", "why", or wants to understand code/concepts.
---

# Explain for Beginners

## Usage

```
explain code [feature-name]        → What the code does
explain concept [concept-name]     → Pattern/concept explanation
explain flow [feature-name]        → Request/data flow
explain why [decision]             → Reasoning behind decisions
```

## Workflow

1. **Ask language**: "English or Vietnamese? (en/vi)"

2. **Read docs FIRST (no source scanning):**

| Mode | Read in order |
|------|---------------|
| `code` | `@docs/ARCHITECTURE.md` → `@docs/PROJECT-RULES.md` |
| `concept` | `@docs/PROJECT-RULES.md` → `@docs/ARCHITECTURE.md` |
| `flow` | `@docs/PRD.md` → `@docs/data/API-CONTRACTS.md` |
| `why` | `@docs/PROJECT-RULES.md` → `@docs/data/DATA-SCHEMA.md` (if relevant) |

3. **Only read specific source file** if user points to exact file

4. **Use template**: `./templates/{en|vi}.md`

## Doc Locations

```
@docs/
├── PRD.md                  ← Product requirements, features, user flows
├── ARCHITECTURE.md         ← Layer structure, folder layout, communication between contexts
├── PROJECT-RULES.md        ← Coding rules, conventions, what AI must not do
└── data/
    ├── API-CONTRACTS.md    ← Message types between popup / background / content script
    └── DATA-SCHEMA.md      ← Storage keys, data types, vocabulary entry shape
```

## Rules

- **NEVER Glob/scan source code**
- Docs contain all architectural decisions
- Only read source when user gives exact file path

## Error Handling

| Error | Action |
|-------|--------|
| Missing mode | Ask: code, concept, flow, or why? |
| Need source detail | Ask user for specific file path |