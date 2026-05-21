// @vitest-environment node

import { describe, expect, it } from 'vitest';

import { hasStringName, isStringCookie } from '@/lib/supabase/cookies';

describe('hasStringName', () => {
    it('akzeptiert Objekte mit string name', () => {
        expect(hasStringName({ name: 'cookie-a', value: 'x' })).toBe(true);
        expect(hasStringName({ name: 'cookie-b' })).toBe(true);
    });

    it('lehnt Werte ohne name ab', () => {
        expect(hasStringName({ value: 'x' })).toBe(false);
        expect(hasStringName({})).toBe(false);
    });

    it('lehnt name mit falschem Typ ab', () => {
        expect(hasStringName({ name: 42 })).toBe(false);
        expect(hasStringName({ name: undefined })).toBe(false);
        expect(hasStringName({ name: null })).toBe(false);
    });

    it('lehnt non-objects ab', () => {
        expect(hasStringName(null)).toBe(false);
        expect(hasStringName(undefined)).toBe(false);
        expect(hasStringName('cookie-a')).toBe(false);
        expect(hasStringName(42)).toBe(false);
    });
});

describe('isStringCookie', () => {
    it('akzeptiert vollständige string-Cookies', () => {
        expect(isStringCookie({ name: 'sb-auth-token', value: 'jwt' })).toBe(true);
    });

    it('lehnt Cookies mit undefined value ab (Next.js 16 Proxy Bug)', () => {
        expect(isStringCookie({ name: 'broken', value: undefined })).toBe(false);
    });

    it('lehnt Cookies mit non-string value ab', () => {
        expect(isStringCookie({ name: 'a', value: 42 })).toBe(false);
        expect(isStringCookie({ name: 'a', value: null })).toBe(false);
    });
});
