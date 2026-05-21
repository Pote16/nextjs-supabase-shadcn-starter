import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from '@/app/page';

describe('HomePage', () => {
    it('rendert die Willkommens-Überschrift', () => {
        render(<HomePage />);
        expect(
            screen.getByRole('heading', {
                name: /willkommen beim next\.js \+ supabase \+ shadcn starter/i,
            }),
        ).toBeInTheDocument();
    });

    it('rendert die Bestätigungs-Message', () => {
        render(<HomePage />);
        expect(screen.getByText(/erfolgreich initialisiert/i)).toBeInTheDocument();
    });
});
