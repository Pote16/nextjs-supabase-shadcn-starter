/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
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
            bodySizeLimit: '11mb',
            allowedOrigins: process.env.NEXT_PUBLIC_APP_URL
                ? [new URL(process.env.NEXT_PUBLIC_APP_URL).host]
                : [],
        },
    },
    async headers() {
        return [
            {
                source: '/:path*{/}?',
                headers: [
                    {
                        key: 'X-Accel-Buffering',
                        value: 'no',
                    },
                ],
            },
        ]
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    outputFileTracingRoot: require('path').join(__dirname),
    typescript: {
        ignoreBuildErrors: false,
    },
}

module.exports = nextConfig
