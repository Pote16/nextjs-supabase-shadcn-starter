---
trigger: always_on
description: "Master-Regel für Microporous ERP: Tech Stack, Architektur, RLS-Sicherheit & Coding Standards."
---

# Project Context: Microporous ERP

Du entwickelst ein hochperformantes ERP-System, das Bestellwesen abbildet, OCR-Fähigkeiten nutzt und Lieferabgleiche bietet.
Das System verwaltet Bestellungen, Lieferscheine, Rechnungen und nutzt KI, um menschliche Arbeit zu minimieren.

## 1. Tech Stack & Rollen

- **Frontend:** Next.js 16+ (App Router), React 19, Tailwind CSS v4, shadcn/ui.
- **State/Caching:** TanStack Query v5 (Server State), Nuqs (URL State).
- **Data Grid:** TanStack Table v8 (Headless UI) - *Kritisch für die Performance von Bestelldaten!*
- **Backend/Auth:** Supabase (PostgreSQL, Auth, Realtime, Storage).
- **PDF/OCR:** pdfjs-dist, jspdf
- **AI/LLM:** ai-sdk (Google Gemini) für Datenstrukturierung.
- **Schema Management:** Native Supabase Migrations (SQL-basiert).
- **Type Generation:** Supabase: `npm run db:types`; Next.js Route Types: `npm run typegen` (params/searchParams in Next 16 sind Promises).
- **Sprache:** TypeScript (Strict mode).

## 2. Kern-Architektur-Regeln (KRITISCH)

### A. Datenbank-Zugriff & Sicherheit (Native Supabase)
1.  **Schema-Hoheit:** SQL-Migrations in `supabase/migrations/` sind die einzige Quelle der Wahrheit (Single Source of Truth) für die Datenbankstruktur.
    - Erstelle Tabellen **NIEMALS** manuell im Supabase Dashboard.
    - Workflow: `npx supabase migration new feature_name` -> SQL schreiben -> lokal `npx supabase migration up` ausführen (Online wird das automatisiert über das Deploy Skript gesteuert).
2.  **Laufzeit-Datenzugriff (Runtime):**
    - **GEBOT:** Nutze **IMMER** das Supabase SDK: `await supabase.from('orders').select('*')`.
    - Grund: RLS-Policies (Sicherheit) werden automatisch von der Datenbank erzwungen.
    - KEIN Prisma!
3.  **Typensicherheit:**
    - Definiere **KEINE** manuellen Interfaces für DB-Tabellen.
    - Nutze **IMMER** die generierten Typen: `import { Database } from '@/types/database.types'`.
    - Nutzung: `type Order = Database['public']['Tables']['orders']['Row']`.

### B. Server Actions vs. API Routes
- **Mutations (Schreiben):** Nutze **Server Actions** (`'use server'`) für alle CREATE/UPDATE/DELETE Operationen.
- **Fetching (Lesen):** Nutze Server Components für den initialen Load und TanStack Query für Interaktivität.
- **Security:** Neue Actions mit `authActionClient`/`adminActionClient` + Zod; `ctx.supabase` statt `createClient()`. Fehler nur via `safeErrorMessage()`. Details in den Security Rules.

## 3. Namenskonventionen
- **Datenbank (SQL):** `snake_case` (`orders`, `created_at`)
- **TypeScript Code:** `camelCase` (`orderList`)
- **Dateinamen:** `kebab-case` (`components/order-card.tsx`)
- **Komponenten:** `PascalCase` (`OrderCard`)

## 4. Coding Standards & Libraries
- Nutze **shadcn/ui** für UI.
- Nutze `@dnd-kit` für Kanban/Drag-and-Drop Operationen bei Bestellungen.
- **TanStack Table:** Nutze dies für alle Listen. Baue keine `<table>` manuell.

### KI & OCR Workflow
1. PDFs werden via `pdfjs-dist` textuell geparst.
2. Extraktionen durch KI erfolgen via `@ai-sdk/google` (strukturiert mit `schema`).
3. LLM Ausgaben **immer** deterministisch validieren, keine Halluzinationen von unautorisierten SKUs zulassen!

## 5. Deployment
- Production via PM2 Deployment (Stand-alone Build, gesteuert über `scripts/deploy.sh`).