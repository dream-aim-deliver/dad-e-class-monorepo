import 'server-only';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import superjson from 'superjson';

function getTRPCUrl(): string {
    const base =
        process.env.E_CLASS_CMS_REST_URL ||
        process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL ||
        'http://localhost:5173';
    return `${base}/api/trpc`;
}

/**
 * Public (unauthenticated) CMS tRPC client with an explicit Accept-Language header.
 * Used by sitemap generation, which runs outside the `[locale]` request tree.
 */
export function createPublicCmsTrpcClient(locale: string) {
    const headers: Record<string, string> = {
        'Accept-Language': locale,
        'x-eclass-session-id': 'public',
    };

    const platformSlug = process.env.NEXT_PUBLIC_E_CLASS_RUNTIME;
    if (platformSlug) {
        headers['x-eclass-runtime'] = platformSlug;
    }

    return createTRPCClient<TAppRouter>({
        links: [
            httpBatchLink({
                transformer: superjson,
                url: getTRPCUrl(),
                headers,
            }),
        ],
    });
}
