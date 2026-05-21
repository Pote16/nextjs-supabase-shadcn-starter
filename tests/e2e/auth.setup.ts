import path from 'node:path';

import { expect, test as setup } from '@playwright/test';

const AUTH_FILE = path.join(__dirname, '.auth/user.json');

const TEST_EMAIL = process.env.PLAYWRIGHT_TEST_EMAIL;
const TEST_PASSWORD = process.env.PLAYWRIGHT_TEST_PASSWORD;

// Setup läuft EINMAL vor allen authenticated Tests.
// Schreibt den eingeloggten Browser-State nach tests/e2e/.auth/user.json,
// danach kann jeder Test diesen State via `storageState` wiederverwenden.
setup('login als Testuser', async ({ page }) => {
    setup.skip(
        !TEST_EMAIL || !TEST_PASSWORD,
        'PLAYWRIGHT_TEST_EMAIL / PLAYWRIGHT_TEST_PASSWORD nicht gesetzt — authenticated Tests werden übersprungen.',
    );

    await page.goto('/login');

    await page.getByLabel(/e-?mail/i).fill(TEST_EMAIL!);
    await page.getByLabel(/passwor[dt]/i).fill(TEST_PASSWORD!);
    await page.getByRole('button', { name: /anmelden|login|sign in/i }).click();

    // Nach erfolgreichem Login redirected die App auf /dashboard.
    await page.waitForURL('**/dashboard', { timeout: 15_000 });
    await expect(page).toHaveURL(/\/dashboard/);

    await page.context().storageState({ path: AUTH_FILE });
});
