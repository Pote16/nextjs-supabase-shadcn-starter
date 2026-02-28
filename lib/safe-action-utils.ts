export class ActionError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'ActionError'
    }
}

export function unwrapResult<T>(result: { data?: T; serverError?: string; validationErrors?: Record<string, string[]> } | undefined) {
    if (!result) return undefined
    if (result.serverError) throw new Error(result.serverError)
    if (result.validationErrors) throw new Error('Validierungsfehler')
    return result.data
}
