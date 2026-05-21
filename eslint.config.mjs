import pluginQuery from '@tanstack/eslint-plugin-query';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    ...pluginQuery.configs['flat/recommended'],

    globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),

    {
        plugins: {
            'simple-import-sort': simpleImportSort,
            'unused-imports': unusedImports,
        },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
            'import/order': 'off',

            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'unused-imports/no-unused-imports': 'error',
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                },
            ],

            'no-console': ['warn', { allow: ['warn', 'error'] }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'react/no-unescaped-entities': 'off',
        },
    },

    { files: ['scripts/**/*.ts'], rules: { 'no-console': 'off' } },

    eslintConfigPrettier,
]);
