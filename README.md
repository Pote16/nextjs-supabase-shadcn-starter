<div align="center">
  <h1>🚀 The Next.js + Supabase + Shadcn Starter</h1>
  <p><strong>Das ultimative, hochperformante Full-Stack-Erlebnis für deine nächste SaaS oder ERP Web-App.</strong></p>
  <p>Baue blitzschnelle UIs mit Next.js 16 (App Router), verwalte sichere und skalierbare Backend-Prozesse mit nativem Supabase und erstelle atemberaubende Designs mit Shadcn UI auf Base UI Primitives.</p>

  <br />

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%206-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest%20v4-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)

  <br />
</div>

---

## ✨ Warum dieser Stack?

Vergiss überladene SPAs und unsichere Setups. Dieser Starter ist die perfekte Balance aus **Developer Experience (DX)** und **brillanter User Experience (UX)**. Entwickelt für komplexe Anwendungen wie Agentur OS, ERPs und skalierbare SaaS-Produkte.

- **⚡ Next.js 16 (App Router)**: Server Components, Server Actions und `proxy.ts` reduzieren Client-JS und sorgen für unglaubliche Performance.
- **🔥 Native Supabase**: Sicherheit direkt auf Row-Level-Security (RLS) Ebene. **Kein Prisma** – reiner und typensicherer Supabase SDK-Zugriff gepaart mit generierten TypeScript-Typen aus den aktuellen SQL-Migrations.
- **💎 Premium Design mit Shadcn UI auf Base UI**: shadcn-Style `base-nova` mit `@base-ui/react` Primitives + Tailwind CSS v4 (CSS-first config, OKLCH-Tokens).
- **🚀 TanStack Ecosystem**: _TanStack Query v5_ für Server-State-Management, _TanStack Table v8 + Virtual_ für performante Daten-Grids.
- **🛡️ Security First**: `next-safe-action` v8 (`.inputSchema()` + Zod v4), CSP mit Nonce + `strict-dynamic`, Rate-Limiting (Redis-bevorzugt mit Memory-Fallback), zentrale Env-Validierung via `@/lib/env`.
- **🧪 Test-Ready out of the box**: Vitest v4 (Unit + Component) und Playwright (E2E) inkl. GitHub Actions CI-Pipeline.
- **📦 Deploy-Ready**: Optimiert für Deployments mit PM2 oder Docker (Standalone-Build). Build-Time-Env-Check schlägt hart fehl bei fehlenden Pflicht-Vars.

---

## 🛠️ Features im Überblick

- **Next.js 16+ App Router** (React 19, Server Components, Server Actions, `proxy.ts`)
- **State & Caching**: TanStack Query v5 & Nuqs für performanten URL-State
- **Supabase Backend**: Auth, PostgreSQL, Realtime, Storage, pgvector
- **Datenbank & ORM**: Supabase SDK + automatische Typen-Generierung aus SQL-Migrations (`pnpm db:types`)
- **Strikte Typensicherheit**: TypeScript 6 (Strict Mode) + Zod v4 für End-to-End-Sicherheit
- **UI & Komponenten**: Tailwind CSS v4 (CSS-first) + Shadcn UI auf Base UI + Lucide Icons
- **Security**: CSP Nonce + strict-dynamic, HSTS preload, Rate-Limiting, sichere Cookie-Defaults
- **Testing**: Vitest v4 + React Testing Library v16 (Unit/Component), Playwright v1.60 (E2E), v8-Coverage
- **CI/CD**: GitHub Actions (typecheck · lint · format · test · build · e2e · audit) mit pnpm-Cache

---

## 🚀 Schnellstart

In 3 Schritten zum fliegenden Start:

### 1. Abhängigkeiten installieren (pnpm vorausgesetzt)

```bash
pnpm install
```

### 2. Env vorbereiten + Supabase / Datenbank Setup

```bash
cp .env.example .env       # Werte ausfüllen
pnpm check-env             # Pflicht-Vars prüfen
pnpm supabase:start        # Lokale Supabase-Instance starten
pnpm db:reset              # Migrations + Seeds anwenden, Typen generieren
```

_(Die Datenbank-Verbindungsdaten und Supabase-Keys findest du in der `.env` Datei – benenne `.env.example` entsprechend um.)_

### 3. Entwicklungsserver starten

```bash
pnpm dev
```

Die App ist unter `http://localhost:3000` erreichbar.

---

## 🧪 Testing

```bash
pnpm test            # Vitest einmalig (Unit + Component)
pnpm test:watch      # Vitest watch-mode
pnpm test:coverage   # v8 Coverage-Report
pnpm test:e2e        # Playwright E2E-Tests
pnpm test:e2e:ui     # Playwright UI-Mode (interaktiv)
```

Volle Test-Doku: [`tests/README.md`](tests/README.md).

---

## 📂 Projekt-Struktur (Highlights)

```text
app/                   App Router (layout liest CSP-Nonce via headers())
lib/
├── env.ts             Single Source für Env-Variablen (lazy validation)
├── auth/routes.ts     PUBLIC_PATHS, AUTH_REDIRECTS, isPublicPath/isWebhookPath
├── security/
│   ├── headers.ts     CSP-Template (gecacht) + Nonce-Generator
│   └── client-ip.ts   Provider-Header-Aware IP-Extraction
├── supabase/
│   ├── client.ts      Browser-Client
│   ├── server.ts      Server-Component-Client
│   ├── middleware.ts  Proxy-Logik (Auth, Rate-Limit, Cookie-Hygiene)
│   └── cookies.ts     Type-Guards + SECURE_COOKIE_DEFAULTS
├── safe-action.ts     authActionClient / adminActionClient (v8 .inputSchema)
├── safe-action-utils.ts  ActionError, safeErrorMessage, unwrapResult
└── rate-limit.ts      Redis-bevorzugt + bounded Memory-Fallback (LRU)
proxy.ts               Next.js 16 Proxy (matcher excludes static assets)
supabase/migrations/   SQL Migrations (template mit RLS-Best-Practices)
tests/                 Vitest + Playwright Test-Suite
.github/workflows/     CI: typecheck + lint + format + test + build + e2e + audit
.claude/ + .cursor/    Persistente Agent-Regeln (project, security, theme, testing, …)
```

---

## 🤝 Agency & Enterprise Support

Du brauchst Unterstützung bei der Skalierung, Architekturentscheidungen oder hast eine konkrete **Projektanfrage** für ein maßgeschneidertes digitales Produkt in diesem sensationellen High-Performance Stack?

Wir bauen Custom Software, die nicht nur messbar schneller ist als die Konkurrenz, sondern Usern eine Experience von höchster Güteklasse bietet.

📩 **Projektanfragen unter:** [dominik@wogenfels.com](mailto:dominik@wogenfels.com)

---

_Built with ❤️ for performance-obsessed developers._
