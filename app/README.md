# `/app` Verzeichnis

Dieser Ordner enthält die **Next.js 16+ App Router** Struktur des nextjs-supabase-shadcn-starter.
Die Routen und Seiten-Hierarchie wird hier definiert.

## Kern-Architektur-Regeln:

1. **Route Groups:**
   Nutze Route Groups in Klammern (z.B. `(admin)`) um logische Bereiche zu trennen, ohne dass diese als Teil in der URL `(z.B. /admin/dashboard)` erscheinen.
2. **`layout.tsx` & `page.tsx`:**
   Seiten immer als `page.tsx` anlegen. Geteilte UI-Skeletons gehören in die passende `layout.tsx`. Server Components sind der Default.

3. **`globals.css`:**
   Enthält Tailwind CSS v4 Definitionen und die shadcn CSS-Variablen.

4. **API Routes (`/app/api/...`):**
   Ausschließlich für **Webhooks (externe System-Pings ohne User-Kontext)** oder **Cronjobs** verwenden. Ansonsten immer **Server Actions** anstelle von API Routes einsetzen.

## Data Fetching:

Der initiale Render geschieht in Server Components. Für Interaktivität und Tabellen nutze TanStack Query mit `hydrate()` oder Initial Data.
