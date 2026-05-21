// Setup-File für Vitest — wird vor jeder Test-Datei einmal geladen.

import '@testing-library/jest-dom/vitest';

import { afterEach } from 'vitest';

// Env-Vars für Tests — verhindert dass `@/lib/env` beim Modul-Import wirft.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??= 'test-anon-key';
process.env.NEXT_PUBLIC_APP_URL ??= 'http://localhost:3000';

// React Testing Library cleanup automatisch nach jedem Test.
// (vitest-jsdom mode + RTL v16 hat das nicht mehr auto-konfiguriert)
afterEach(async () => {
    const { cleanup } = await import('@testing-library/react');
    cleanup();
});
