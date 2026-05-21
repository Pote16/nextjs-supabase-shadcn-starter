import { describe, expect, it } from 'vitest';

import { ActionError, safeErrorMessage, unwrapResult } from '@/lib/safe-action-utils';

describe('ActionError', () => {
    it('setzt name auf "ActionError"', () => {
        const error = new ActionError('Test');
        expect(error.name).toBe('ActionError');
    });

    it('ist eine Error-Instance', () => {
        const error = new ActionError('Test');
        expect(error).toBeInstanceOf(Error);
    });

    it('behält die übergebene Message', () => {
        const error = new ActionError('Spezifische Nachricht');
        expect(error.message).toBe('Spezifische Nachricht');
    });
});

describe('safeErrorMessage', () => {
    it('extrahiert message aus Error-Instances', () => {
        const result = safeErrorMessage(new Error('Echte Nachricht'));
        // Im jsdom-env ist NODE_ENV "test", IS_DEV ist trotzdem true (≠ production).
        expect(result).toBe('Echte Nachricht');
    });

    it('extrahiert message aus error-ähnlichen Objekten', () => {
        const result = safeErrorMessage({ message: 'Custom-Object' });
        expect(result).toBe('Custom-Object');
    });

    it('konvertiert Strings via String()', () => {
        const result = safeErrorMessage('plain string');
        expect(result).toBe('plain string');
    });

    it('konvertiert null gracefully', () => {
        const result = safeErrorMessage(null);
        expect(result).toBe('null');
    });
});

describe('unwrapResult', () => {
    it('gibt undefined zurück bei undefined Input', () => {
        expect(unwrapResult(undefined)).toBeUndefined();
    });

    it('gibt data zurück bei erfolgreichem Result', () => {
        const result = unwrapResult({ data: { foo: 'bar' } });
        expect(result).toEqual({ foo: 'bar' });
    });

    it('wirft ActionError bei serverError', () => {
        expect(() => unwrapResult({ serverError: 'Server kaputt' })).toThrow(ActionError);
        expect(() => unwrapResult({ serverError: 'Server kaputt' })).toThrow('Server kaputt');
    });

    it('wirft ActionError mit Feldliste bei validationErrors', () => {
        try {
            unwrapResult({ validationErrors: { email: ['ungültig'], name: ['leer'] } });
            expect.fail('Sollte werfen');
        } catch (error) {
            expect(error).toBeInstanceOf(ActionError);
            expect((error as Error).message).toContain('email');
            expect((error as Error).message).toContain('name');
        }
    });
});
