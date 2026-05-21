// Defensive Cookie-Helpers für Next.js 16 Proxy.
// In Next.js 16 kann das Cookie-Objekt im Proxy einen undefined `value`
// enthalten — Supabase SSR ruft intern charCodeAt() auf, was dann wirft.

import { type CookieOptions } from '@supabase/ssr';

import { IS_PROD } from '@/lib/env';

export type StringCookie = { name: string; value: string };

export function hasStringName(c: unknown): c is { name: string } {
    return (
        typeof c === 'object' && c !== null && typeof (c as { name?: unknown }).name === 'string'
    );
}

export function isStringCookie(c: unknown): c is StringCookie {
    return hasStringName(c) && typeof (c as { value?: unknown }).value === 'string';
}

// Defaults für sicheres Cookie-Setzen — wird beim Löschen verwendet, damit
// die Lösch-Cookies nicht ohne secure/httpOnly/sameSite gesetzt werden
// (sonst MITM-Cookie-Tossing in Production).
export const SECURE_COOKIE_DEFAULTS: CookieOptions = {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: 'lax',
    path: '/',
};
