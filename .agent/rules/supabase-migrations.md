---
trigger: model_decision
description: "when updating database or working on /supabase"
---

# Supabase Migrations - Native Workflow (Kein Prisma!)

## 🚨 KRITISCH: Native Supabase Ansatz

Microporous ERP nutzt einen **reinen Supabase-Workflow** für Datenbank-Management:

### Lokale Entwicklung (Docker)
1. **Supabase CLI** verwaltet das komplette Schema (SQL-Migrations)
2. **Type-Generierung** aus der Datenbank (keine manuellen Interfaces)
3. **Docker** läuft lokal für isolierte Entwicklung

### Workflow: Schema-Änderungen

#### Schritt 1: Neue Migration erstellen
`npx supabase migration new add_feature_column`

#### Schritt 2: SQL schreiben
```sql
ALTER TABLE public.orders ADD COLUMN feature_name TEXT;
```

#### Schritt 3: Lokal anwenden & Typen generieren
`npx supabase migration up`

#### Schritt 4: Code anpassen
```typescript
import { Database } from '@/types/database.types'

type Order = Database['public']['Tables']['orders']['Row']
```

## 📝 Naming Conventions
- **Format:** `YYYYMMDDHHMMSS_description.sql`

## 🎯 Best Practices
1. Idempotenz: Nutze IMMER `CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`.
2. JEDE neue Tabelle braucht RLS.
3. **IMMER `(select auth.uid())` statt `auth.uid()` verwenden!** (Performance)
4. RLS Policies filtern **NICHT** nach `deleted_at`. Dies geschieht im Code.

## 🤖 Für KI-Assistenten
Wenn du Datenbank-Änderungen vornehmen sollst:
1. Neue Migration erstellen
2. SQL schreiben
3. Idempotent machen
4. User informieren: "Führe `npx supabase migration up` aus"

❌ **NIEMALS:**
- Prisma-Code generieren (Prisma ist hier nicht vorhanden!)
- Direkt in Production-DB ändern (nur via Migrations)
