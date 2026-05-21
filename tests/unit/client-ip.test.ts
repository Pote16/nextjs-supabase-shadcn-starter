// @vitest-environment node

import { type NextRequest } from 'next/server';
import { describe, expect, it } from 'vitest';

import { getClientIp } from '@/lib/security/client-ip';

function fakeRequest(headers: Record<string, string>): NextRequest {
    return {
        headers: {
            get(name: string) {
                return headers[name.toLowerCase()] ?? null;
            },
        },
    } as unknown as NextRequest;
}

describe('getClientIp', () => {
    it('bevorzugt cf-connecting-ip', () => {
        const req = fakeRequest({
            'cf-connecting-ip': '1.2.3.4',
            'x-forwarded-for': '5.6.7.8',
        });
        expect(getClientIp(req)).toBe('1.2.3.4');
    });

    it('nimmt x-vercel-forwarded-for wenn kein Cloudflare', () => {
        const req = fakeRequest({
            'x-vercel-forwarded-for': '9.8.7.6, 1.1.1.1',
            'x-forwarded-for': '5.6.7.8',
        });
        expect(getClientIp(req)).toBe('9.8.7.6');
    });

    it('nimmt fly-client-ip wenn weder Cloudflare noch Vercel', () => {
        const req = fakeRequest({ 'fly-client-ip': '10.0.0.1' });
        expect(getClientIp(req)).toBe('10.0.0.1');
    });

    it('nimmt x-real-ip vor x-forwarded-for', () => {
        const req = fakeRequest({
            'x-real-ip': '4.3.2.1',
            'x-forwarded-for': '5.6.7.8',
        });
        expect(getClientIp(req)).toBe('4.3.2.1');
    });

    it('nimmt erste IP aus x-forwarded-for als Fallback', () => {
        const req = fakeRequest({ 'x-forwarded-for': '10.0.0.1, 192.168.1.1' });
        expect(getClientIp(req)).toBe('10.0.0.1');
    });

    it('gibt null zurück wenn keine IP-Header gesetzt sind', () => {
        const req = fakeRequest({});
        expect(getClientIp(req)).toBeNull();
    });

    it('ignoriert leere Strings', () => {
        const req = fakeRequest({
            'cf-connecting-ip': '   ',
            'x-real-ip': '5.5.5.5',
        });
        expect(getClientIp(req)).toBe('5.5.5.5');
    });
});
