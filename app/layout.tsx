import './globals.css';

import type { Metadata } from 'next';
import { headers } from 'next/headers';

import { NONCE_HEADER } from '@/lib/env';

export const metadata: Metadata = {
    title: 'Next.js + Supabase + shadcn Starter',
    description: 'Production-ready SaaS / ERP Starter mit KI- und OCR-Fähigkeiten.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    // Nonce aus dem Proxy lesen → Next.js bindet den Nonce automatisch
    // an seine Framework-Scripts, was 'strict-dynamic' in Production ermöglicht.
    const nonce = (await headers()).get(NONCE_HEADER) ?? undefined;

    return (
        <html lang="de" suppressHydrationWarning>
            <body className="antialiased" data-nonce={nonce}>
                {children}
            </body>
        </html>
    );
}
