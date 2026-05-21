import { type NextRequest } from 'next/server';

// Reihenfolge: spezifische Provider-Header → generische → Fallback.
// `X-Forwarded-For` ist clientseitig spoofbar, daher zuletzt geprüft und
// nur dann genutzt, wenn kein spezifischer Provider-Header existiert.
//
// In Production hinter mehreren Hops sollte stattdessen ein
// Reverse-Proxy einen vertrauenswürdigen Header setzen (Cloudflare:
// cf-connecting-ip, Vercel: x-vercel-forwarded-for, Fly: fly-client-ip).
export function getClientIp(request: NextRequest): string | null {
    const cf = request.headers.get('cf-connecting-ip')?.trim();
    if (cf) return cf;

    const vercel = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
    if (vercel) return vercel;

    const fly = request.headers.get('fly-client-ip')?.trim();
    if (fly) return fly;

    const real = request.headers.get('x-real-ip')?.trim();
    if (real) return real;

    // X-Forwarded-For: Bei einem Hop ist der erste Eintrag der echte Client-IP.
    // Spoofbar — Rate-Limits sollten anhand des IP zusätzlich ein App-Token-Limit haben.
    const xff = request.headers.get('x-forwarded-for');
    if (xff) {
        const first = xff.split(',')[0]?.trim();
        if (first) return first;
    }

    return null;
}
