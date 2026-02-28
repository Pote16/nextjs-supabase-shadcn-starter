export function safeErrorMessage(
    error: unknown,
    fallback = 'Ein Fehler ist aufgetreten'
): string {
    const message = error instanceof Error
        ? error.message
        : typeof error === 'object' && error !== null && 'message' in error
            ? String((error as { message: unknown }).message)
            : String(error);

    if (process.env.NODE_ENV === 'development') {
        return message;
    }

    console.error('[ServerAction Error]', message);
    return fallback;
}
