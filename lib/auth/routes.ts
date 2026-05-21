// Zentrale Route-Konfiguration für Auth/Public-Paths und Redirects.
// Importierbar aus middleware, server components, tests.

export const PUBLIC_PATHS = ['/login', '/auth/callback', '/api/webhooks', '/api/cron'] as const;

export const WEBHOOK_PATHS = ['/api/webhooks', '/api/cron'] as const;

export const AUTH_REDIRECTS = {
    afterLogin: '/dashboard',
    unauthenticated: '/login',
} as const;

export function isPublicPath(pathname: string): boolean {
    return PUBLIC_PATHS.some((prefix) => pathname.startsWith(prefix));
}

export function isWebhookPath(pathname: string): boolean {
    return WEBHOOK_PATHS.some((prefix) => pathname.startsWith(prefix));
}
