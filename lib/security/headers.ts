import { type NextResponse } from 'next/server';

import { env, IS_DEV } from '@/lib/env';

export const SECURITY_HEADERS_BASE: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'on',
    // browsing-topics ist der Topics-API-Nachfolger von FLoC; interest-cohort bleibt
    // als Defense-in-Depth gegen ältere Browser, die FLoC noch verstehen.
    'Permissions-Policy':
        'camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-site',
};

// Statisches CSP-Template — Werte die nicht pro Request variieren, werden
// einmalig beim ersten Aufruf gebaut. Nur Nonce wird pro Request ersetzt.
let cspTemplateProd: string | null = null;
let cspTemplateDev: string | null = null;

const NONCE_PLACEHOLDER = '__CSP_NONCE__';

function buildCspTemplate(isDev: boolean): string {
    const supabaseOrigin = safeSupabaseOrigin();
    const supabaseWsOrigin = supabaseOrigin ? supabaseOrigin.replace(/^http/, 'ws') : '';

    const join = (parts: string[]) =>
        parts
            .filter(Boolean)
            .map((s) => (s === 'self' ? "'self'" : s))
            .join(' ');

    const connectSrc = join([
        'self',
        supabaseOrigin,
        supabaseWsOrigin,
        '*.supabase.co',
        'wss://*.supabase.co',
    ]);
    const imgSrc = join(['self', 'blob:', 'data:', supabaseOrigin, '*.supabase.co']);
    const mediaSrc = join(['self', 'blob:', supabaseOrigin, '*.supabase.co']);

    const scriptSrc = isDev
        ? `'self' 'unsafe-eval' 'nonce-${NONCE_PLACEHOLDER}'`
        : `'self' 'nonce-${NONCE_PLACEHOLDER}' 'strict-dynamic'`;

    // style-src 'unsafe-inline' bleibt, bis Browser-Support für Nonce-Bindung
    // an Tailwind/Next.js-injected <style>-Tags ausreichend ist.
    const parts = [
        "default-src 'self'",
        `script-src ${scriptSrc}`,
        "style-src 'self' 'unsafe-inline'",
        `img-src ${imgSrc}`,
        `media-src ${mediaSrc}`,
        `connect-src ${connectSrc}`,
        "font-src 'self' data:",
        "frame-src 'none'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "worker-src 'self' blob:",
        "manifest-src 'self'",
        ...(isDev ? [] : ['upgrade-insecure-requests']),
    ];
    return parts.join('; ');
}

// safeSupabaseOrigin liest die env lazy — falls noch nicht gesetzt
// (z.B. während des Builds), wird ein leerer String zurückgegeben.
function safeSupabaseOrigin(): string {
    try {
        return env.SUPABASE_ORIGIN;
    } catch {
        return '';
    }
}

function getCspTemplate(): string {
    if (IS_DEV) {
        if (!cspTemplateDev) cspTemplateDev = buildCspTemplate(true);
        return cspTemplateDev;
    }
    if (!cspTemplateProd) cspTemplateProd = buildCspTemplate(false);
    return cspTemplateProd;
}

export function buildCspHeader(nonce: string): string {
    return getCspTemplate().replaceAll(NONCE_PLACEHOLDER, nonce);
}

export function applySecurityHeaders(response: NextResponse, nonce: string): NextResponse {
    for (const [key, value] of Object.entries(SECURITY_HEADERS_BASE)) {
        response.headers.set(key, value);
    }
    response.headers.set('Content-Security-Policy', buildCspHeader(nonce));
    return response;
}

export function generateNonce(): string {
    // 16 Bytes = 128 Bit Entropie, base64-codiert ~22 Zeichen — CSP-konform.
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
}
