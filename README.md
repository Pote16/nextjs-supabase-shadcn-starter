<div align="center">
  <h1>🚀 The Next.js + Supabase + Shadcn Starter</h1>
  <p><strong>Das ultimative, hochperformante Full-Stack-Erlebnis für deine nächste SaaS oder ERP Web-App.</strong></p>
  <p>Baue blitzschnelle UIs mit Next.js 16 (App Router), verwalte sichere und skalierbare Backend-Prozesse mit nativem Supabase und erstelle atemberaubende Designs mit Shadcn UI.</p>

  <br />

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![React](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

  <br />
</div>

---

## ✨ Warum dieser Stack?

Vergiss überladene SPAs und unsichere Setups. Dieser Starter ist die perfekte Balance aus **Developer Experience (DX)** und **brillanter User Experience (UX)**. Entwickelt für komplexe Anwendungen wie Agentur OS, ERPs und skalierbare SaaS-Produkte.

- **⚡ Next.js 16 (App Router)**: Server Components und Server Actions reduzieren Client-JS und sorgen für unglaubliche Performance.
- **🔥 Native Supabase**: Nutze die volle Power der Datenbank. Sicherheit direkt auf Row-Level-Security (RLS) Ebene. **Kein Prisma** – reiner und typensicherer Supabase SDK-Zugriff gepaart mit generierten TypeScript-Typen aus den aktuellen SQL-Migrations.
- **💎 Premium Design mit Shadcn UI**: Vorgefertigte, wunderschöne und hoch anpassbare Komponenten kombiniert mit Tailwind CSS v4.
- **🚀 TanStack Ecosystem**: Das Setup nutzt _TanStack Query v5_ für Server-State-Management, Caching und _TanStack Table v8_ für performante Daten-Grids.
- **🛡️ Security First**: Strenge Server Actions über `safe-action` (z.B. `authActionClient`, `adminActionClient`) gekoppelt mit strikter Zod-Validierung.
- **📦 Deploy-Ready**: Optimiert für Deployments mit PM2 auf eigenen Servern oder in der Cloud.

---

## 🛠️ Features im Überblick

- **Next.js 16+ App Router** (React 19, Server Components, Server Actions)
- **State & Caching**: TanStack Query v5 & Nuqs für performanten URL-State
- **Supabase Backend**: Auth, PostgreSQL, Realtime, Storage, pgvector
- **Datenbank & ORM**: Supabase SDK + automatische Typen-Generierung aus SQL-Migrations (`npm run db:types`)
- **Strikte Typensicherheit**: TypeScript (Strict Mode) + Zod für End-to-End Sicherheit
- **UI & Komponenten**: Tailwind CSS v4 + Shadcn UI + Lucide Icons

---

## 🚀 Schnellstart

In 3 Schritten zum fliegenden Start:

### 1. Abhängigkeiten installieren (pnpm vorausgesetzt)

```bash
pnpm install
```

### 2. Supabase / Datenbank Setup

Schau in den `/supabase/migrations` Ordner für das Datenbankschema.
Starte die generierung und aktualisiere deine Typen nach Änderungen:

```bash
npx supabase db reset
npm run db:types
```

_(Die Datenbank-Verbindungsdaten und Supabase-Keys findest du in der `.env` Datei – benenne `.env.example` entsprechend um)._

### 3. Entwicklungsserver starten

```bash
pnpm run dev
```

Die App ist unter `http://localhost:3000` erreichbar.

---

## 🤝 Agency & Enterprise Support

Du brauchst Unterstützung bei der Skalierung, Architekturentscheidungen oder hast eine konkrete **Projektanfrage** für ein maßgeschneidertes digitales Produkt in diesem sensationellen High-Performance Stack?

Wir bauen Custom Software, die nicht nur messbar schneller ist als die Konkurrenz, sondern Usern eine Experience von höchster Güteklasse bietet.

📩 **Projektanfragen unter:** [dominik@wogenfels.com](mailto:dominik@wogenfels.com)

---

_Built with ❤️ for performance-obsessed developers._
