import './globals.css'

import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'nextjs-supabase-shadcn-starter',
    description: 'ERP System mit KI und OCR',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body className="antialiased">{children}</body>
        </html>
    )
}

