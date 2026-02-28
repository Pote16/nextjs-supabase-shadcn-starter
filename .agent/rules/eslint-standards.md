---
trigger: model_decision
description: "ESLint- und Linting-Konventionen für Microporous ERP: Unused Vars, Console, any, exhaustive-deps."
---

# ESLint & Linting Standards

Konfiguration: `eslint.config.mjs`. Plugins: `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, `simple-import-sort`, `unused-imports`.

## 1. Ungenutzte Variablen & Parameter (`unused-imports/no-unused-vars`)

Das `varsIgnorePattern` und `argsIgnorePattern` ist `^_` – Variablen/Parameter mit `_`-Prefix lösen keine Warnung aus.

- **Variablen:** Prefix mit `_` wenn zugewiesen aber nie gelesen.
- **Imports:** Ungenutzte Imports werden durch `unused-imports/no-unused-imports` automatisch bei "Fix on Save" entfernt.

## 2. Console (`no-console`)

Nur `console.warn` und `console.error` sind erlaubt. `console.log` löst eine Warnung aus.

- **Produktionscode:** Kein `console.log` – stattdessen `console.warn` oder `console.error`.
- **Scripts (`scripts/**/*.ts`):** `no-console` ist via Override deaktiviert.

## 3. Typsicherheit (`@typescript-eslint/no-explicit-any`)

Als `warn` konfiguriert – schrittweise Reduzierung.

- **Bevorzugt:** `unknown` + Type Guards, oder generierte Supabase-Typen (`Database['public']['Tables']['<table>']['Row']`).
- **Verboten:** Neue `any`-Typen ohne Begründung.

## 4. Import-Sortierung (`simple-import-sort`)

Als `error` – Imports werden automatisch bei "Fix on Save" sortiert.
