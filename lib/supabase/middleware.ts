import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { AUTH_REDIRECTS, isPublicPath, isWebhookPath } from '@/lib/auth/routes';
import { env, NONCE_HEADER } from '@/lib/env';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/security/client-ip';
import { applySecurityHeaders, generateNonce } from '@/lib/security/headers';
import { isStringCookie, SECURE_COOKIE_DEFAULTS } from '@/lib/supabase/cookies';

async function applyAuthRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip = getClientIp(request) ?? 'unknown';
    const rateLimit = await checkRateLimit(`auth:ip:${ip}`, RATE_LIMITS.authPerIp);
    if (!rateLimit.limited) return null;

    const response = NextResponse.json({ error: 'Zu viele Anmeldeversuche.' }, { status: 429 });
    response.headers.set('Retry-After', String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)));
    return response;
}

async function applyWebhookRateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip = getClientIp(request) ?? 'unknown';
    const rateLimit = await checkRateLimit(`webhook:ip:${ip}`, RATE_LIMITS.webhook);
    if (!rateLimit.limited) return null;

    const response = NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
    response.headers.set('Retry-After', String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)));
    return response;
}

function cleanupStaleSupabaseCookies(request: NextRequest, response: NextResponse): void {
    const expectedPrefix = `sb-${env.SUPABASE_PROJECT_REF}-auth-token`;
    if (!env.SUPABASE_PROJECT_REF) return;

    const cookies = request.cookies.getAll().filter(isStringCookie);
    for (const { name } of cookies) {
        if (
            name.startsWith('sb-') &&
            name.includes('-auth-token') &&
            !name.startsWith(expectedPrefix)
        ) {
            response.cookies.set(name, '', { ...SECURE_COOKIE_DEFAULTS, maxAge: 0 });
        }
    }
}

function createMiddlewareSupabaseClient(request: NextRequest, response: NextResponse) {
    return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return request.cookies.getAll().filter(isStringCookie);
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
                for (const { name, value, options } of cookiesToSet) {
                    if (typeof name !== 'string' || typeof value !== 'string') continue;
                    request.cookies.set(name, value);
                    response.cookies.set(name, value, options);
                }
            },
        },
    });
}

export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const nonce = generateNonce();
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(NONCE_HEADER, nonce);

    const secure = (res: NextResponse) => applySecurityHeaders(res, nonce);

    // Rate-Limits VOR Supabase-Client-Init — sparen Roundtrip wenn schon geblockt.
    if (pathname === '/login' && request.method === 'POST') {
        const blocked = await applyAuthRateLimit(request);
        if (blocked) return secure(blocked);
    }

    if (isWebhookPath(pathname)) {
        const blocked = await applyWebhookRateLimit(request);
        if (blocked) return secure(blocked);
    }

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    secure(response);
    cleanupStaleSupabaseCookies(request, response);

    // Webhook-/Cron-Endpunkte haben eigene Auth (HMAC, Secret-Header) —
    // wir sparen den Supabase-Roundtrip.
    if (isWebhookPath(pathname)) {
        return response;
    }

    try {
        const supabase = createMiddlewareSupabaseClient(request, response);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user && !isPublicPath(pathname) && pathname !== '/') {
            return secure(
                NextResponse.redirect(new URL(AUTH_REDIRECTS.unauthenticated, request.url)),
            );
        }

        if (user && (pathname === '/login' || pathname === '/')) {
            return secure(NextResponse.redirect(new URL(AUTH_REDIRECTS.afterLogin, request.url)));
        }

        return response;
    } catch {
        return secure(NextResponse.redirect(new URL(AUTH_REDIRECTS.unauthenticated, request.url)));
    }
}
