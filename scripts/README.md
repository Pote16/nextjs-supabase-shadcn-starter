# `/scripts` Verzeichnis

Dieses Verzeichnis beinhaltet alle Hilfsskripte (meist Bash oder TypeScript) für Deployment, Datenbank-Operations oder sonstige Workflows.

## Enthaltene Skripte

- `deploy.sh`: PM2 Deployment Workflow. Zieht Änderungen, installiert Dependencies, baut die App und lädt PM2 neu.

## Lokale Skripte

Falls Skripte lokal direkt über npm ausgeführt werden sollen, definiere sie in der `package.json` und rufe sie hier auf.
Beispiel `package.json`:
```json
"scripts": {
   "db:reset": "npx supabase db reset"
}
```
