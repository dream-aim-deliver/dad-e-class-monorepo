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
    images: {
        localPatterns: [
            {
                pathname: '/api/favicon',
                // search omitted → allows any query string (?domain=...)
            },
            {
                pathname: '/**',
                search: '',
            },
        ],
        // Next 16's image optimizer refuses to fetch upstreams that resolve to a
        // private IP (SSRF protection). Inside the fra1 cluster DigitalOcean
        // resolves fra1.digitaloceanspaces.com to a private VPC IP (e.g. 10.x) so
        // same-region Spaces traffic stays on the private network, which makes the
        // optimizer reject every DO-hosted image with 400 "url" parameter is not
        // allowed. remotePatterns below is the real trust boundary (only those
        // hosts can be fetched at all), so we opt in to allowing private-IP
        // upstreams for DO-hosted deployments via IMAGE_ALLOW_LOCAL_IP. The strict
        // default stays on for any deployment that doesn't set it. See issue #710.
        dangerouslyAllowLocalIP:
            process.env.NODE_ENV === 'development' ||
            process.env.IMAGE_ALLOW_LOCAL_IP === 'true',
        formats: ['image/avif', 'image/webp'],
        // Cache optimized images for 10 hours minimum, matching signed URL TTL from MinIO
        minimumCacheTTL: 36000,
        remotePatterns: [
            {
                protocol: 'https',
                // The path for mock data. Should be configured with environment variables in production.
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'static.wixstatic.com',
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
            // DuckDuckGo favicon service for link previews
            {
                protocol: 'https',
                hostname: 'icons.duckduckgo.com',
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
    }: undefined,
};

const plugins = [
    // Add more Next.js plugins to this list if needed.
    withNx,
    withNextIntl, // Add the next-intl plugin
];

module.exports = composePlugins(...plugins)(nextConfig);
