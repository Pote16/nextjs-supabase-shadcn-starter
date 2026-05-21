# `/components` Verzeichnis

Dieser Ordner enthält alle **React UI Komponenten** für das ERP System.

## Architektur & Richtlinien:

1. **shadcn/ui (`/components/ui/`)**:
   Hier werden generierte Komponenten via `npx shadcn@latest add [component]` abgelegt. Diese Dateien sind generiert und sollten nur minimalistisch (z.B. für Styling-Anpassungen) bearbeitet werden.

2. **Feature-Komponenten (`/components/[feature]/`)**:
   Gruppiere fachliche Komponenten immer nach Domäne:
    - `/components/orders/OrderTable.tsx`
    - `/components/kanban/BoardEngine.tsx`

3. **Performance (Kriterium 1):**
    - Nutze stets **TanStack Table** (V8) für Listen und Grids.
    - Rendere keine rohen `<table>` Elemente, es sei denn es handelt sich im simple Displays (z.B. in PDFs).
    - Nutze `@tanstack/react-virtual` wenn mehr als 100 Datensätze in einer Table via DOM angezeigt werden könnten.
4. **Icons:**
   Nutze `lucide-react` für die Iconsheeds und UI-Elemente.

5. **KI/AI Elements:**
   Komponenten, die Output von `@ai-sdk` (Generative UI) rendern, gehören zur leichteren Trennung in einen separaten Ordner (z.B. `/components/ai/`).
