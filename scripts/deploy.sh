#!/usr/bin/env bash
# =============================================================================
# nextjs-supabase-shadcn-starter – Auto-Deploy für Next.js App (Cloud-Server, z. B. Ploi/PM2)
# =============================================================================
# Wird nach git pull ausgeführt (z. B. vom Server-Deploy-Script).
# Muss aus dem Projektroot ausgeführt werden.
#
# Einmalig auf dem Server: PM2-App anlegen, z. B.:
#   npm install
#   npm run build
#   pm2 start npm --name "nextjs-supabase-shadcn-starter" -- start
#   pm2 save && pm2 startup
# =============================================================================

set -e

# Env aus .env laden (falls vorhanden)
if [ -f .env ]; then
  set -a
  source .env 2>/dev/null || true
  set +a
fi

echo "==> nextjs-supabase-shadcn-starter – Deploy (Next.js)"
# DevDependencies mit installieren (Tailwind, PostCSS etc. – nötig für den Build)
echo "==> npm install (inkl. devDependencies für Build)"
npm install --include=dev

# Optional: Supabase-Migrations gegen Cloud-DB pushen (vor dem Build)
if [ -n "$SUPABASE_PROJECT_REF" ]; then
  echo "==> Supabase: Migrations pushen (Projekt: $SUPABASE_PROJECT_REF)"
  if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then echo "   SUPABASE_ACCESS_TOKEN: gesetzt"; else echo "   SUPABASE_ACCESS_TOKEN: NICHT gesetzt"; fi
  if npx supabase link --project-ref "$SUPABASE_PROJECT_REF"; then
    npx supabase db push --include-all || echo "   (keine neuen Migrations oder Fehler – fahre fort)"
  else
    echo "   Supabase-Link fehlgeschlagen (siehe Fehler oben)"
  fi
else
  echo "==> Supabase DB-Update übersprungen (SUPABASE_PROJECT_REF nicht gesetzt)"
fi

echo "==> Alte Build-Artefakte entfernen"
rm -rf .next

echo "==> Next.js Production-Build (inkl. Standalone)"
npm run build

echo "==> PM2: App neu starten (Name: nextjs-supabase-shadcn-starter)"
pm2 restart nextjs-supabase-shadcn-starter 2>/dev/null || pm2 restart all
pm2 save

echo "==> Deploy fertig."

