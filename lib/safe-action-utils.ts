import { IS_DEV } from '@/lib/env';

export class ActionError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ActionError';
    }
}

const GENERIC_ERROR_MESSAGE = 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.';

// Konvertiert unbekannte Fehler in eine sichere, client-taugliche Message.
// In Development wird die Original-Message zurückgegeben (Debug-Komfort),
// in Production die generische Fallback-Message (kein Internals-Leak).
export function safeErrorMessage(error: unknown, fallback = GENERIC_ERROR_MESSAGE): string {
    const message =
        error instanceof Error
            ? error.message
            : typeof error === 'object' && error !== null && 'message' in error
              ? String((error as { message: unknown }).message)
              : String(error);

    return IS_DEV ? message : fallback;
}

export type ActionResult<T> = {
    data?: T;
    serverError?: string;
    validationErrors?: Record<string, string[]>;
};

// Wirft `ActionError` bei serverError oder Validierungsfehlern — damit
// Konsumenten konsistent `e instanceof ActionError` prüfen können.
export function unwrapResult<T>(result: ActionResult<T> | undefined): T | undefined {
    if (!result) return undefined;
    if (result.serverError) throw new ActionError(result.serverError);
    if (result.validationErrors) {
        const fields = Object.keys(result.validationErrors).join(', ');
        throw new ActionError(`Validierungsfehler: ${fields}`);
    }
    return result.data;
}
