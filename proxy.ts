export { updateSession as proxy } from '@/lib/supabase/middleware';

export const config = {
    matcher: [
        // Ausgenommen: statische Assets, Next-internals, Manifests, Sitemaps, Sourcemaps, Fonts.
        // Alles andere (Pages + APIs) bekommt Security-Headers, Auth-Check, Rate-Limits.
        '/((?!_next/static|_next/image|_next/data|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|map)$).*)',
    ],
};
