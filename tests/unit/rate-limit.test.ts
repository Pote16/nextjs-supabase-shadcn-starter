// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

describe('checkRateLimit (in-memory fallback)', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('lässt den ersten Request durch und decrementiert remaining', async () => {
        const result = await checkRateLimit('test:first', { limit: 5, windowSeconds: 60 });
        expect(result.limited).toBe(false);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(4);
    });

    it('blockt nach Erreichen des Limits', async () => {
        const config = { limit: 3, windowSeconds: 60 };
        const id = 'test:limit';

        await checkRateLimit(id, config);
        await checkRateLimit(id, config);
        await checkRateLimit(id, config);
        const blocked = await checkRateLimit(id, config);

        expect(blocked.limited).toBe(true);
        expect(blocked.remaining).toBe(0);
        expect(blocked.resetAt).toBeGreaterThan(Date.now());
    });

    it('reset nach Ablauf des Window', async () => {
        const config = { limit: 2, windowSeconds: 1 };
        const id = 'test:reset';

        await checkRateLimit(id, config);
        await checkRateLimit(id, config);
        const blocked = await checkRateLimit(id, config);
        expect(blocked.limited).toBe(true);

        vi.advanceTimersByTime(1500);

        const fresh = await checkRateLimit(id, config);
        expect(fresh.limited).toBe(false);
        expect(fresh.remaining).toBe(1);
    });

    it('isoliert verschiedene Identifier', async () => {
        const config = { limit: 1, windowSeconds: 60 };

        await checkRateLimit('user:a', config);
        const a2 = await checkRateLimit('user:a', config);
        const b1 = await checkRateLimit('user:b', config);

        expect(a2.limited).toBe(true);
        expect(b1.limited).toBe(false);
    });
});

describe('RATE_LIMITS Konfiguration', () => {
    it('enthält alle benötigten Schlüssel', () => {
        expect(RATE_LIMITS).toHaveProperty('webhook');
        expect(RATE_LIMITS).toHaveProperty('api');
        expect(RATE_LIMITS).toHaveProperty('authPerIp');
        expect(RATE_LIMITS).toHaveProperty('authPerIpExtended');
        expect(RATE_LIMITS).toHaveProperty('authPerEmail');
    });

    it('hat sinnvolle Defaults für Auth-Limits', () => {
        // Auth-Limits sind enger als API-Limits, sonst wäre der Schutz wirkungslos.
        expect(RATE_LIMITS.authPerIp.limit).toBeLessThan(RATE_LIMITS.api.limit);
        expect(RATE_LIMITS.authPerEmail.limit).toBeLessThan(RATE_LIMITS.authPerIp.limit);
    });
});
