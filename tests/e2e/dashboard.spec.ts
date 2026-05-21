import { expect, test } from '@playwright/test';

// Diese Tests benötigen den `setup`-Project (Auth-Storage). Konfiguriert in playwright.config.ts.
// Werden übersprungen wenn PLAYWRIGHT_TEST_EMAIL/PASSWORD nicht gesetzt sind (siehe auth.setup.ts).

test.describe('Dashboard (authenticated)', () => {
    test('lädt nach Login', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/\/dashboard/);
    });
});
