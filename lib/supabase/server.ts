import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { env } from '@/lib/env';
import { isStringCookie } from '@/lib/supabase/cookies';

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        cookies: {
            getAll() {
                return cookieStore.getAll().filter(isStringCookie);
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
                try {
                    for (const { name, value, options } of cookiesToSet) {
                        cookieStore.set(name, value, options);
                    }
                } catch {
                    // In Server Components ist cookies().set() readonly — Middleware
                    // refreshed die Session danach via setAll, daher ignorierbar.
                }
            },
        },
    });
}
