import {
    createSafeActionClient,
} from 'next-safe-action'
import { z } from 'zod'

import { createClient } from '@/lib/supabase/server'
export { ActionError, unwrapResult } from '@/lib/safe-action-utils'
import { ActionError } from '@/lib/safe-action-utils'

// ---------- Base Client ----------
export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        })
    },
    handleServerError(e, utils) {
        if (e instanceof ActionError) {
            return e.message
        }

        if (process.env.NODE_ENV === 'development') {
            console.error(`[SafeAction] ${utils?.metadata?.actionName || 'unknown'}:`, e.message)
            return e.message
        }

        console.error(`[SafeAction] ${utils?.metadata?.actionName || 'unknown'}:`, e.message)
        return 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.'
    },
})

// ---------- Auth Client ----------
export const authActionClient = actionClient.use(async ({ next }) => {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new ActionError('Nicht authentifiziert')
    }

    return next({
        ctx: {
            userId: user.id,
            user,
            supabase,
        },
    })
})

// ---------- Admin Client ----------
export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
    const { data: profile } = await ctx.supabase
        .from('profiles')
        .select('role_id')
        .eq('id', ctx.userId)
        .single()

    if (profile?.role_id !== 'admin') {
        throw new ActionError('Keine Berechtigung')
    }

    return next({
        ctx: {
            ...ctx,
            isAdmin: true as const,
        },
    })
})
