import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT ?? 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
    testDir: './tests/e2e',
    outputDir: './tests/e2e/.results',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    timeout: 30_000,
    expect: { timeout: 5_000 },
    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        // Setup-Project läuft einmalig vor allen Tests — schreibt Auth-Storage-State.
        { name: 'setup', testMatch: /.*\.setup\.ts/ },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: './tests/e2e/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'public',
            // Anonyme Routen — kein storageState.
            testMatch: /.*\.public\.spec\.ts/,
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        // Build vorher (CI) oder Dev (lokal) — beides via pnpm.
        command: process.env.CI ? 'pnpm start' : 'pnpm dev',
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: 'ignore',
        stderr: 'pipe',
    },
});
