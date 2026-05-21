// @vitest-environment node

import { describe, expect, it } from 'vitest';

import {
    AUTH_REDIRECTS,
    isPublicPath,
    isWebhookPath,
    PUBLIC_PATHS,
    WEBHOOK_PATHS,
} from '@/lib/auth/routes';

describe('isPublicPath', () => {
    it.each(PUBLIC_PATHS)('erkennt "%s" als public', (path) => {
        expect(isPublicPath(path)).toBe(true);
    });

    it('erkennt sub-paths als public', () => {
        expect(isPublicPath('/api/webhooks/stripe')).toBe(true);
        expect(isPublicPath('/auth/callback?code=abc')).toBe(true);
    });

    it('blockt private Routen', () => {
        expect(isPublicPath('/dashboard')).toBe(false);
        expect(isPublicPath('/api/users')).toBe(false);
        expect(isPublicPath('/settings/billing')).toBe(false);
    });
});

describe('isWebhookPath', () => {
    it.each(WEBHOOK_PATHS)('erkennt "%s" als webhook', (path) => {
        expect(isWebhookPath(path)).toBe(true);
    });

    it('isolated von normalen public-paths', () => {
        expect(isWebhookPath('/login')).toBe(false);
        expect(isWebhookPath('/auth/callback')).toBe(false);
    });
});

describe('AUTH_REDIRECTS', () => {
    it('hat sinnvolle Defaults', () => {
        expect(AUTH_REDIRECTS.afterLogin).toBe('/dashboard');
        expect(AUTH_REDIRECTS.unauthenticated).toBe('/login');
    });
});
