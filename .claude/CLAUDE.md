# Next.js + Supabase + shadcn Starter

Hochperformanter SaaS- / ERP-Starter auf Next.js 16 + Supabase + shadcn (Base UI).
KI-Workflows (OCR, LLM-Strukturierung) und sichere Mandantentrennung via Supabase RLS.

## Tech Stack

- **Frontend:** Next.js 16+ (App Router, `proxy.ts` statt `middleware.ts`), React 19, Tailwind v4 (CSS-first), shadcn auf Base UI (`@base-ui/react`).
- **State:** TanStack Query v5 (Server State), Nuqs (URL State), TanStack Table v8 + Virtual.
- **Backend:** Supabase (Postgres, Auth, Realtime, Storage), `@supabase/ssr`.
- **Server Actions:** `next-safe-action` v8 (`.inputSchema()`) + Zod v4.
- **AI/PDF:** `ai-sdk` (Google Gemini), `pdfjs-dist`, `jspdf`.
- **Package Manager:** pnpm. Niemals npm/yarn — Lockfile-Konflikte.

## Wichtigste Befehle

- `pnpm dev` — Dev-Server mit Turbopack
- `pnpm build` — Production Build (Standalone)
- `pnpm typecheck` — TypeScript ohne Emit
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm db:reset` — Supabase neustarten + Migrations + Seed + Type-Gen
- `pnpm db:types` — Typen aus Supabase generieren
- `pnpm exec shadcn add <name>` — shadcn-Komponente installieren (Base UI Style)

## Architektur-Regeln

Themen-spezifische Regeln in [.claude/rules/](.claude/rules/). Hier nur das Wichtigste:

- **Env:** Alle Env-Variablen via `@/lib/env` — niemals direkt `process.env.*` außerhalb von `lib/env.ts`.
- **Datenbank:** SQL-Migrations in `supabase/migrations/` sind Single Source of Truth. Runtime nur via Supabase SDK (RLS enforced).
- **Server Actions:** `authActionClient` / `adminActionClient` aus `@/lib/safe-action`, `.inputSchema()` (v8) mit Zod, `ctx.supabase`.
- **UI:** shadcn-Komponenten via `pnpm exec shadcn add` — Base UI Style (`base-nova`) ist konfiguriert. Keine `@radix-ui/*`.
- **Theme:** Tailwind v4 CSS-first in `app/globals.css` mit OKLCH-Tokens unter `@theme inline`.
- **Routing-Konstanten:** Public-Paths, Webhook-Paths, Redirects zentral in `@/lib/auth/routes`.
- **Security Headers:** `@/lib/security/headers` mit gecachtem CSP-Template + Nonce.

## Namenskonventionen

- DB (SQL): `snake_case` (`orders`, `created_at`)
- TypeScript: `camelCase` (`orderList`)
- Dateinamen: `kebab-case` (`components/order-card.tsx`)
- Komponenten: `PascalCase` (`OrderCard`)

## Verbote

- **KEIN** Prisma. Wir nutzen ausschließlich Supabase SDK.
- **KEIN** `@radix-ui/*`. Radix ist komplett entfernt — Base UI ist die Primitive-Library.
- **KEIN** `tailwind.config.ts` / `tailwind.config.js`. Tailwind v4 ist CSS-first.
- **KEIN** `tailwindcss-animate`. Wir nutzen `tw-animate-css`.
- **KEIN** `console.log` in Produktionscode. `console.warn` / `console.error` sind erlaubt.
- **KEIN** `npm` / `yarn`. Nur pnpm.
- **KEINE** Tailwind-Arbitrary-Values für Farben (`bg-[#fff]`). Immer Token nutzen.

## Workflow für neue Features

1. Schema-Änderung? → `pnpm db:migrate <name>` → SQL schreiben (idempotent, RLS) → `pnpm db:reset` → `pnpm db:types`.
2. Server Action? → `authActionClient.metadata({...}).inputSchema(z.object({...})).action(...)`.
3. UI-Komponente? → `pnpm exec shadcn add <name>` oder bestehende erweitern. Theme-Tokens aus `globals.css`.
4. Vor Commit: `pnpm typecheck && pnpm lint && pnpm format:check`.

## Deployment

- Production: PM2 via `scripts/deploy.sh` oder Docker via `Dockerfile`. Beides pnpm + Standalone Build.
- Build-Time Env-Check via `scripts/check-env.mjs` — schlägt hart fehl bei fehlenden Pflicht-Vars.
