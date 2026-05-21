---
paths:
    - '**/*.ts'
    - '**/*.tsx'
    - '**/*.mjs'
    - '**/*.js'
    - 'eslint.config.mjs'
---

# ESLint & Linting Standards

Konfiguration: `eslint.config.mjs`. Plugins: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, `@tanstack/eslint-plugin-query`, `simple-import-sort`, `unused-imports`.

## 1. Ungenutzte Variablen & Parameter (`unused-imports/no-unused-vars`)

`varsIgnorePattern` und `argsIgnorePattern` ist `^_` — Variablen/Parameter mit `_`-Prefix lösen keine Warnung aus.

- **Variablen:** Prefix mit `_` wenn zugewiesen aber nie gelesen.
- **Imports:** Ungenutzte Imports werden durch `unused-imports/no-unused-imports` automatisch bei "Fix on Save" entfernt.

## 2. Console (`no-console`)

Nur `console.warn` und `console.error` sind erlaubt. `console.log` löst eine Warnung aus.

- **Produktionscode:** Kein `console.log` — stattdessen `console.warn` oder `console.error`.
- **Scripts (`scripts/**/\*.ts`):** `no-console` ist via Override deaktiviert.

## 3. Typsicherheit (`@typescript-eslint/no-explicit-any`)

Als `warn` konfiguriert — schrittweise Reduzierung.

- **Bevorzugt:** `unknown` + Type Guards, oder generierte Supabase-Typen (`Database['public']['Tables']['<table>']['Row']`).
- **Verboten:** Neue `any`-Typen ohne Begründung.

## 4. Import-Sortierung (`simple-import-sort`)

Als `error` — Imports werden automatisch bei "Fix on Save" sortiert.

## 5. Prettier

Konfiguration in `.prettierrc`: `tabWidth: 4`, `semi: true`, `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`.

- Prüfen: `pnpm format:check`
- Anwenden: `pnpm format`

## 6. TypeScript Strict Mode

`tsconfig.json` hat `strict: true`. Keine implicit `any`, keine non-null assertions ohne klare Begründung.

- `process.env.X!` → niemals direkt. Stattdessen `env.X` aus `@/lib/env` (validiert lazy).
