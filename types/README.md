# `/types` Verzeichnis

Hier liegen alle app-übergreifenden TypeScript-Typisierung.

## Generierte Supabase Typen

Eine der essenziellsten Dateien hier wird (bzw. ist) die `database.types.ts`.
Diese Datei ist **autogeneriert** aus dem Supabase Schema und darf niemals manuell editiert werden.

**Workflow:**
Sobald über `npx supabase migration` und `npm run db:reset` eine Datenbankänderung durchgeführt wurde, führe `npm run db:types` (`npx supabase gen types typescript --local > types/database.types.ts`) aus, um sie zu aktualisieren.

**Nutzung in der App:**

```typescript
import { Database } from '@/types/database.types';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
```
