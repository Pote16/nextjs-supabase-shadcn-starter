import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    outputFileTracingRoot: __dirname,
    typescript: {
        ignoreBuildErrors: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
    experimental: {
        serverActions: {
            // 4MB Default; größere Uploads via Supabase Storage signed-URLs direkt vom Client.
            bodySizeLimit: '4mb',
            allowedOrigins: process.env.NEXT_PUBLIC_APP_URL
                ? [new URL(process.env.NEXT_PUBLIC_APP_URL).host]
                : [],
        },
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [{ key: 'X-Accel-Buffering', value: 'no' }],
            },
        ];
    },
};

export default nextConfig;
