# `/lib` Verzeichnis

Dieses Verzeichnis beinhaltet die Kernlogik und wiederverwendbare Dienste (Services / API Adapter) der App.
Genauso befinden sich hier alle Security- und Server-Action-Setups.

## Kernbestandteile:

1. **`safe-action.ts`**: 
   Unsere Implementation von `next-safe-action` für validierte, typensichere und geschützte Mutations.
   - `authActionClient`
   - `adminActionClient`

2. **`/supabase`**:
   Beinhaltet das Instanziieren von Supabase-Clients.
   - `server.ts` (Next Server Components)
   - `client.ts` (Next Client Components)
   - `middleware.ts` (Router Protection / Session Updates)

3. **`rate-limit.ts`**:
   Globaler Rate Limiter (Redis / In-Memory).

4. **Third Party Services**:
   - Packe weitere externe Client-Setups hier rein, z.B. für Google Gemini/AI-SDK oder PDF.js-Logik.
   - Code der Server-side only ist, bleibt strukturell in Servere-Dateien.
