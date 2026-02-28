import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit'

// Public paths that do not require auth
const PUBLIC_PATHS = ['/login', '/auth/callback', '/api/webhooks', '/api/cron']

const SECURITY_HEADERS_BASE: Record<string, string> = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-DNS-Prefetch-Control': 'on',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
}

function buildCspHeader(nonce: string): string {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : ''
    const supabaseWsOrigin = supabaseOrigin ? supabaseOrigin.replace(/^http/, 'ws') : ''
    const connectSrcParts = ['self', supabaseOrigin, supabaseWsOrigin, '*.supabase.co', 'wss://*.supabase.co']
    const connectSrc = connectSrcParts.filter(Boolean).map(s => s === 'self' ? "'self'" : s).join(' ')
    const imgSrc = ['self', 'blob:', 'data:', supabaseOrigin, '*.supabase.co'].filter(Boolean).map(s => s === 'self' ? "'self'" : s).join(' ')
    const mediaSrc = ['self', 'blob:', 'data:', supabaseOrigin, '*.supabase.co'].filter(Boolean).map(s => s === 'self' ? "'self'" : s).join(' ')

    const parts = [
        "default-src 'self'",
        `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
        "style-src 'self' 'unsafe-inline'",
        `img-src ${imgSrc}`,
        `media-src ${mediaSrc}`,
        `connect-src ${connectSrc}`,
        "font-src 'self'",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
    ]
    return parts.join('; ')
}

function applySecurityHeaders(response: NextResponse, nonce: string): void {
    for (const [key, value] of Object.entries(SECURITY_HEADERS_BASE)) {
        response.headers.set(key, value)
    }
    response.headers.set('Content-Security-Policy', buildCspHeader(nonce))
}

export async function updateSession(request: NextRequest) {
    const { pathname } = request.nextUrl
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)

    // Rate Limiting
    if (pathname === '/login' && request.method === 'POST') {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
        const rateLimit = await checkRateLimit(`auth:ip:${ip}`, RATE_LIMITS.auth)
        if (rateLimit.limited) {
            const blockedResponse = NextResponse.json({ error: 'Zu viele Anmeldeversuche.' }, { status: 429 })
            blockedResponse.headers.set('Retry-After', String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)))
            applySecurityHeaders(blockedResponse, nonce)
            return blockedResponse
        }
    }

    const response = NextResponse.next({ request: { headers: requestHeaders } })
    applySecurityHeaders(response, nonce)

    // Cookie-Hygiene
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const projectRef = supabaseUrl ? new URL(supabaseUrl).hostname.split('.')[0] : ''
        if (projectRef) {
            const expectedPrefix = `sb-${projectRef}-auth-token`
            const allCookies = request.cookies.getAll()
            for (const { name } of allCookies) {
                if (name.startsWith('sb-') && name.includes('-auth-token') && !name.startsWith(expectedPrefix)) {
                    response.cookies.set(name, '', { maxAge: 0, path: '/' })
                }
            }
        }
    } catch { }

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return request.cookies.getAll() },
                    setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value)
                            response.cookies.set(name, value, options)
                        })
                    },
                },
            }
        )

        const { data: { user } } = await supabase.auth.getUser()
        const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path))

        if (!user && !isPublicPath && pathname !== '/') {
            const res = NextResponse.redirect(new URL('/login', request.url))
            applySecurityHeaders(res, nonce)
            return res
        }

        if (user) {
            if (pathname === '/login' || pathname === '/') {
                const res = NextResponse.redirect(new URL('/dashboard', request.url))
                applySecurityHeaders(res, nonce)
                return res
            }
        }

        return response
    } catch {
        const res = NextResponse.redirect(new URL('/login', request.url))
        applySecurityHeaders(res, nonce)
        return res
    }
}
