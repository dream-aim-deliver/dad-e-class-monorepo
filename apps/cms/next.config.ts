import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';
const { composePlugins, withNx } = require('@nx/next');

const withNextIntl = createNextIntlPlugin(
    './src/lib/infrastructure/server/config/next-intl/request.ts',
);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig: NextConfig = {
    nx: {
        // Set this to true if you would like to use SVGR
        // See: https://github.com/gregberge/svgr
        svgr: false,
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        // Cache optimized images for 10 hours minimum, matching signed URL TTL from MinIO
        minimumCacheTTL: 36000,
        remotePatterns: [
            {
                protocol: 'https',
                // The path for mock data. Should be configured with environment variables in production.
                hostname: 'res.cloudinary.com',
            },
            // Gravatar for user avatars
            {
                protocol: 'https',
                hostname: 's.gravatar.com',
            },
            {
                protocol: 'https',
                hostname: 'cdn.auth0.com',
            },
            // DigitalOcean Spaces (production)
            {
                protocol: 'https',
                hostname: 'fra1.digitaloceanspaces.com',
            },
            // Mux video thumbnails and assets
            {
                protocol: 'https',
                hostname: '**.mux.com',
            },
            // Custom S3/MinIO (configured via environment variables for local dev)
            ...(process.env.S3_HOSTNAME ? [{
                protocol: (process.env.S3_PROTOCOL || 'http') as 'http' | 'https',
                hostname: process.env.S3_HOSTNAME,
                ...(process.env.S3_PORT && { port: process.env.S3_PORT }),
            }] : []),
        ],
    },
    compiler: process.env.NODE_ENV === 'production' ? {
        removeConsole: {
            exclude: ['error', 'warn'],
        },
    } : undefined,
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
    withNextIntl, // Add the next-intl plugin
];

module.exports = composePlugins(...plugins)(nextConfig);
