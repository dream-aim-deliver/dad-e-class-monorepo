import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
    return (
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000'
    ).replace(/\/$/, '');
}

/**
 * Disallow private / transactional surfaces. Locale-prefixed paths are listed
 * explicitly because robots.txt wildcards are not consistently supported.
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = getBaseUrl();

    const disallow = [
        '/de/workspace',
        '/en/workspace',
        '/de/workspace/',
        '/en/workspace/',
        '/de/auth',
        '/en/auth',
        '/de/auth/',
        '/en/auth/',
        '/de/checkout',
        '/en/checkout',
        '/de/checkout/',
        '/en/checkout/',
    ];

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow,
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
