// Single source of truth für Pflicht-Env-Variablen.
// Lazy-validiert (per Getter), damit der Build ohne gesetzte Vars durchläuft,
// aber zur Runtime sofort und laut fehlschlägt statt silent zu korrumpieren.

function required(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`[env] Fehlende Pflicht-Umgebungsvariable: ${key}`);
    }
    return value;
}

function optional(key: string): string | undefined {
    const value = process.env[key];
    return value && value.length > 0 ? value : undefined;
}

// Lazy cache: parsing/validation läuft beim ersten Zugriff, nicht beim Import.
let supabaseInfoCache: {
    url: string;
    anonKey: string;
    origin: string;
    wsOrigin: string;
    projectRef: string;
} | null = null;

function getSupabaseInfo() {
    if (supabaseInfoCache) return supabaseInfoCache;
    const url = required('NEXT_PUBLIC_SUPABASE_URL');
    const anonKey = required('NEXT_PUBLIC_SUPABASE_ANON_KEY');
    const parsed = new URL(url);
    supabaseInfoCache = {
        url,
        anonKey,
        origin: parsed.origin,
        wsOrigin: parsed.origin.replace(/^http/, 'ws'),
        projectRef: parsed.hostname.split('.')[0] ?? '',
    };
    return supabaseInfoCache;
}

export const env = {
    get NODE_ENV() {
        return (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test';
    },
    get APP_URL() {
        return optional('NEXT_PUBLIC_APP_URL');
    },
    get SUPABASE_URL() {
        return getSupabaseInfo().url;
    },
    get SUPABASE_ANON_KEY() {
        return getSupabaseInfo().anonKey;
    },
    get SUPABASE_ORIGIN() {
        return getSupabaseInfo().origin;
    },
    get SUPABASE_WS_ORIGIN() {
        return getSupabaseInfo().wsOrigin;
    },
    get SUPABASE_PROJECT_REF() {
        return getSupabaseInfo().projectRef;
    },
    get REDIS_URL() {
        return optional('REDIS_URL');
    },
    get REDIS_HOST() {
        return optional('REDIS_HOST');
    },
    get REDIS_PORT() {
        return optional('REDIS_PORT');
    },
    get REDIS_PASSWORD() {
        return optional('REDIS_PASSWORD');
    },
} as const;

export const IS_DEV = process.env.NODE_ENV !== 'production';
export const IS_PROD = process.env.NODE_ENV === 'production';

export const NONCE_HEADER = 'x-nonce' as const;
