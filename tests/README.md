# Tests

Diese Test-Suite ist auf vier Ebenen aufgeteilt:

## Struktur

```
tests/
├── unit/          # Pure-Function Tests (lib/, utils/, helpers/)
├── integration/   # Tests die mehrere Module zusammen testen (z. B. Server Actions
│                  # gegen eine lokale Supabase-Instance)
├── e2e/           # Playwright End-to-End-Tests (echte Browser, echte App)
├── fixtures/      # Statische Testdaten (JSON, CSV, sample-PDFs)
└── setup.ts       # Vitest Setup (jest-dom matchers, env defaults, cleanup)
```

## Befehle

| Befehl                  | Was es tut                                         |
| ----------------------- | -------------------------------------------------- |
| `pnpm test`             | Vitest einmal durchlaufen (Unit + Integration)     |
| `pnpm test:watch`       | Vitest watch-mode                                  |
| `pnpm test:ui`          | Vitest UI (Browser-basiert)                        |
| `pnpm test:coverage`    | Coverage-Report (v8 provider, HTML in `coverage/`) |
| `pnpm test:e2e`         | Playwright E2E-Tests                               |
| `pnpm test:e2e:ui`      | Playwright UI-Mode (interaktiv)                    |
| `pnpm test:e2e:install` | Browser für CI installieren (`chromium`)           |

## Konventionen

- **File-Naming:** `<name>.test.ts(x)` oder `<name>.spec.ts(x)`. Tests liegen NEBEN den unit/integration Ordnern — nicht im Source-Tree (sonst landen sie im Build-Output).
- **describe + it:** `describe('FunctionName', () => { it('beschreibt verhalten', ...) })`.
- **Arrange / Act / Assert:** Tests sind in 3 Blöcke aufgeteilt mit Leerzeile zwischen den Sektionen.
- **Mocks:** Mocks sparsam einsetzen. Pure Functions brauchen keine Mocks. DB-Aufrufe in Integration-Tests gegen lokale Supabase-Instance (kein Mock).
- **Setup pro Test:** `beforeEach` für State-Reset; `afterEach` nur wenn nötig (RTL cleanup ist global in setup.ts).
- **Coverage:** Mindest-Threshold ist 60% Lines/Statements/Functions, 50% Branches. CI failed bei Unterschreitung.

## E2E (Playwright)

- E2E-Tests starten den Dev-Server automatisch (`webServer` in `playwright.config.ts`).
- Auth wird einmal via `tests/e2e/auth.setup.ts` durchlaufen, das Storage-State wird in `playwright/.auth/` gespeichert.
- Tests die Auth brauchen: Project `chromium` (mit storageState). Tests ohne Auth: `test.use({ storageState: { cookies: [], origins: [] } })`.

## Lokale Supabase-Instance

Integration-Tests gegen die echte DB benötigen `pnpm supabase:start`. Vor dem Lauf:

```bash
pnpm supabase:start
pnpm db:reset   # frische Migrations + Seeds
pnpm test       # läuft Vitest gegen die lokale Supabase
```

In CI ist der Supabase-Container Teil der GitHub-Actions-Pipeline.
