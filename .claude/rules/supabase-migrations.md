---
paths:
    - 'supabase/**/*.sql'
    - 'supabase/**/*.toml'
    - 'types/database.types.ts'
    - 'types/database.zod.ts'
---

# Supabase Migrations — Native Workflow

## Ansatz

- **Supabase CLI** verwaltet das komplette Schema (SQL-Migrations).
- **Type-Generierung** aus der Datenbank (keine manuellen Interfaces).
- **Docker** läuft lokal für isolierte Entwicklung.

## Workflow: Schema-Änderungen

### 1. Neue Migration erstellen

```bash
pnpm db:migrate add_feature_column
```

### 2. SQL schreiben (idempotent + RLS)

```sql
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS feature_name TEXT;
```

### 3. Lokal anwenden & Typen generieren

```bash
pnpm supabase db reset
pnpm db:types
```

### 4. Code anpassen

```typescript
import { Database } from '@/types/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
```

## Naming Conventions

- **Format:** `YYYYMMDDHHMMSS_description.sql` (von der CLI automatisch generiert)
- **Description:** kurz, snake_case (`create_orders_table`, `add_orders_status_index`)

## Best Practices

1. **Idempotenz:** IMMER `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`.
2. **RLS:** Jede neue Tabelle MUSS RLS haben. Separate Policies pro Operation (kein `FOR ALL`).
3. **Performance:** IMMER `(select auth.uid())` statt `auth.uid()` in Policies (Initplan-Cache).
4. **Soft-Delete:** RLS-Policies filtern **NICHT** nach `deleted_at` — das passiert im App-Code.
5. **Indizes:** Für Foreign Keys, häufige Filter-Spalten, `created_at`-Sortierungen.
6. **Trigger:** `updated_at` via Trigger auf jeder Tabelle mit Mutation.

## Template

Vorlage für neue Tabellen: `supabase/migrations/00000000000000_template_rls.sql.example`.

## Verbote

- Prisma-Code generieren (Prisma ist hier nicht vorhanden).
- Direkt in Production-DB ändern (nur via Migrations).
- RLS deaktivieren oder `FOR ALL USING (true)` Policy schreiben.
- `auth.uid()` direkt statt `(select auth.uid())`.
