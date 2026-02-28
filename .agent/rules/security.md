---
trigger: always_on
description: "Sicherheitsstandards: Server Actions, Auth-Clients, Rate Limiting, CSP, Fehlerbehandlung, Uploads, XSS."
---

# Security Standards (Microporous ERP)

Diese Regeln sind verbindlich für das ERP-System.

## 1. Server Actions

- **Neue Actions:** Immer `authActionClient` oder `adminActionClient` aus `lib/safe-action.ts`; **niemals** manuell `createClient()` in der Action – nutze `ctx.supabase`.
- **Input:** Zod-Schema über `.schema(z.object({ ... }))`; ungültige Payloads immer ablehnen.

## 2. Fehler & Secrets

- **Fehler an den Client:** Nur `safeErrorMessage()` (`lib/utils/safe-error.ts`) oder `ActionError`; **keine** Roh-Fehlermeldungen aus der Datenbank leaken.
- **Secrets:** Keine Env-Variablen mit Secrets im Client (`NEXT_PUBLIC_*` nur für nicht-sensible Werte); Service-Role-Key niemals im Frontend.

## 3. Auth & Erreichbarkeit

- Externe APIs (wie Gemini/OpenAI via ai-sdk) werden **immer** serverseitig aufgerufen und niemals mit dem Key im Client.
- Redirects nach Logins geschehen deterministisch (z.B. zurück zum Dashboard).
- Keine unvalidierten URLs für Redirects annehmen (Open Redirect Prävention).

## 4. Rate Limiting

- Konfiguration erfolgt in `lib/rate-limit.ts`. Nutzt Redis oder In-Memory Fallback.
- Schütze sensible Pfade (Auth-Callbacks, Passworteingaben) strikt durch Rate-Limiting.

## 5. Security Headers (CSP)

- Headers und CSP: `middleware.ts` → `lib/supabase/middleware.ts`. 
- `connect-src` muss den Supabase-Origin enthalten (dynamisch aus `NEXT_PUBLIC_SUPABASE_URL`).

## 6. Uploads (z.B. Lieferscheine PDFs) & XSS

- Für Rechnungen / PDFs: Strengste MIME-Types prüfen. Magic Byte Evaluation wenn möglich.
- Dateinamen vor dem Speichern in Supabase Storage sanitizen.
- User-generierte Inhalte niemals direkt im DOM als HTML einkippen ohne Sanitisierung.
