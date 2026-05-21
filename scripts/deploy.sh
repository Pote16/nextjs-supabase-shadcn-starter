#!/usr/bin/env bash
# =============================================================================
# Auto-Deploy für Next.js App (Cloud-Server, z. B. Ploi/PM2)
# =============================================================================
# Wird nach git pull ausgeführt (Server-Deploy-Script).
# Muss aus dem Projektroot ausgeführt werden.
#
# Einmalig auf dem Server (pnpm via corepack, PM2-App anlegen):
#   corepack enable
#   pnpm install --frozen-lockfile
#   pnpm build
#   pm2 start pnpm --name "nextjs-supabase-shadcn-starter" -- start
#   pm2 save && pm2 startup
# =============================================================================

set -euo pipefail

if [ -f .env ]; then
    set -a
    # shellcheck disable=SC1091
    source .env 2>/dev/null || true
    set +a
fi

echo "==> Deploy: nextjs-supabase-shadcn-starter"

if ! command -v pnpm >/dev/null 2>&1; then
    echo "==> pnpm nicht gefunden — aktiviere via corepack"
    corepack enable
fi

echo "==> Pflicht-Env prüfen"
node scripts/check-env.mjs

echo "==> pnpm install --frozen-lockfile"
pnpm install --frozen-lockfile

if [ -n "${SUPABASE_PROJECT_REF:-}" ]; then
    echo "==> Supabase Migrations pushen (Projekt: $SUPABASE_PROJECT_REF)"
    if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
        echo "   ! SUPABASE_ACCESS_TOKEN nicht gesetzt — Push überspringen"
    elif pnpm exec supabase link --project-ref "$SUPABASE_PROJECT_REF"; then
        pnpm exec supabase db push --include-all || echo "   (keine neuen Migrations oder Fehler — fahre fort)"
    else
        echo "   ! Supabase-Link fehlgeschlagen"
    fi
else
    echo "==> Supabase DB-Update übersprungen (SUPABASE_PROJECT_REF nicht gesetzt)"
fi

echo "==> Alte Build-Artefakte entfernen"
rm -rf .next

echo "==> pnpm build (Standalone)"
pnpm build

echo "==> PM2 restart"
pm2 restart nextjs-supabase-shadcn-starter 2>/dev/null || pm2 restart all
pm2 save

echo "==> Deploy fertig."
