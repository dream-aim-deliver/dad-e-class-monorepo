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
        remotePatterns: [
            {
                protocol: 'https',
                // The path for mock data. Should be configured with environment variables in production.
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            ...(process.env.MINIO_HOSTNAME ? [{
                protocol: (process.env.MINIO_PROTOCOL || 'http') as 'http' | 'https',
                hostname: process.env.MINIO_HOSTNAME,
                ...(process.env.MINIO_PORT && { port: process.env.MINIO_PORT }),
            }] : []),
        ],
    },
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
    withNextIntl, // Add the next-intl plugin
];

module.exports = composePlugins(...plugins)(nextConfig);
