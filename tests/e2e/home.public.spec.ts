import { expect, test } from '@playwright/test';

test.describe('Home (anonym)', () => {
    test('zeigt Willkommens-Heading', async ({ page }) => {
        await page.goto('/');

        await expect(
            page.getByRole('heading', {
                name: /willkommen beim next\.js \+ supabase \+ shadcn starter/i,
            }),
        ).toBeVisible();
    });

    test('setzt sicherheitsrelevante Response-Header', async ({ page }) => {
        const response = await page.goto('/');
        expect(response).not.toBeNull();

        const headers = response!.headers();
        expect(headers['x-frame-options']).toBe('DENY');
        expect(headers['x-content-type-options']).toBe('nosniff');
        expect(headers['strict-transport-security']).toContain('max-age=63072000');
        expect(headers['content-security-policy']).toMatch(/nonce-/);
        expect(headers['content-security-policy']).toContain("frame-ancestors 'none'");
    });
});
