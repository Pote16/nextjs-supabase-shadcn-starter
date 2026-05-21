import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import { ActionError, safeErrorMessage } from '@/lib/safe-action-utils';
import { createClient } from '@/lib/supabase/server';

export { ActionError, safeErrorMessage, unwrapResult } from '@/lib/safe-action-utils';

// ---------- Base Client ----------
export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
    handleServerError(error, utils) {
        if (error instanceof ActionError) return error.message;

        const actionName = utils?.metadata?.actionName ?? 'unknown';
        console.error(`[SafeAction] ${actionName}:`, error.message);
        return safeErrorMessage(error);
    },
});

// ---------- Auth Client ----------
export const authActionClient = actionClient.use(async ({ next }) => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new ActionError('Nicht authentifiziert');
    }

    return next({
        ctx: {
            userId: user.id,
            user,
            supabase,
        },
    });
});

// ---------- Admin Client ----------
export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
    const { data: profile, error } = await ctx.supabase
        .from('profiles')
        .select('role_id, is_active')
        .eq('id', ctx.userId)
        .maybeSingle();

    if (error) {
        console.error('[adminActionClient] profile lookup failed:', error.message);
        throw new ActionError('Keine Berechtigung');
    }

    if (!profile || profile.role_id !== 'admin' || profile.is_active === false) {
        throw new ActionError('Keine Berechtigung');
    }

    return next({
        ctx: {
            ...ctx,
            isAdmin: true as const,
        },
    });
});
