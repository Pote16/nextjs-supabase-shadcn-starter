# `/supabase` Verzeichnis

Dieser Ordner ist das Herzstück des Native-Supabase Workflows für das nextjs-supabase-shadcn-starter Schema.
Prisma wird hier **nicht** verwendet!

## Wichtigste Bereiche:

1. **`/migrations`**:
   Beinhaltet alle SQL-Routinen (Tabellenkreierung, RLS-Policies, Indizierungen).
    - Workflow für Neues: `npx supabase migration new name_des_features`.
    - Lokales anwenden: `npx supabase migration up` (führt neue Migrations lokal aus).
2. **`seed.sql`**:
   Kann mit `npx supabase db reset` ausgeführt werden, um Testdaten oder initiale Kataloge herzustellen.

3. **`config.toml`**:
   Definiert die lokale Supabase Konfiguration (Ports, Features, Studio).
