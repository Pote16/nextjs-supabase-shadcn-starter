import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
    test: {
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        // jsdom für Component-Tests; einzelne Unit-Tests können via @vitest-environment node overriden.
        environment: 'jsdom',
        include: ['tests/**/*.{test,spec}.{ts,tsx}'],
        exclude: ['tests/e2e/**', 'node_modules/**', '.next/**'],
        clearMocks: true,
        restoreMocks: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: [
                'lib/**/*.{ts,tsx}',
                'app/**/*.{ts,tsx}',
                'components/**/*.{ts,tsx}',
                'hooks/**/*.{ts,tsx}',
            ],
            exclude: ['**/*.d.ts', '**/*.config.*', '**/types/**', '**/.next/**', 'tests/**'],
            thresholds: {
                lines: 60,
                statements: 60,
                functions: 60,
                branches: 50,
            },
        },
    },
});
