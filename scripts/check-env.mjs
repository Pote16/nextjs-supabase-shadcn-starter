#!/usr/bin/env node
/* eslint-disable no-console */
// Prüft, ob alle Pflicht-Umgebungsvariablen vorhanden sind.
// Wird vor `pnpm setup`, im Docker-Build und vor Deploy ausgeführt.

import 'dotenv/config';

const REQUIRED = [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

const OPTIONAL = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'REDIS_URL',
    'REDIS_HOST',
    'REDIS_PORT',
    'REDIS_PASSWORD',
    'GOOGLE_API_KEY',
    'OPENAI_API_KEY',
];

const missing = REQUIRED.filter((key) => !process.env[key]);
const presentOptional = OPTIONAL.filter((key) => process.env[key]);

if (missing.length > 0) {
    console.error('[FAIL] Fehlende Pflicht-Umgebungsvariablen:');
    for (const key of missing) console.error(`  - ${key}`);
    console.error('\nLege .env an (Vorlage: .env.example) und setze die obigen Werte.');
    process.exit(1);
}

console.log('[OK] Alle Pflicht-Umgebungsvariablen sind gesetzt.');
if (presentOptional.length > 0) {
    console.log(`  Optionale erkannt: ${presentOptional.join(', ')}`);
}
