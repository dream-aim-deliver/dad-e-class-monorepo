import { unstable_cache } from 'next/cache';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { TAppRouter, TGetPlatformSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
import superjson from 'superjson';

/**
 * Gets the TRPC URL from runtime environment variables
 */
function getTRPCUrl(): string {
    const base =
        process.env.E_CLASS_CMS_REST_URL ||
        process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL ||
        'http://localhost:5173';
    return `${base}/api/trpc`;
}

/**
 * Fetches platform data with server-side caching.
 *
 * Cache expires after 15 minutes, reducing server load and improving performance.
 * Platform data (logo, name, theme) rarely changes, making it ideal for caching.
 *
 * @param locale - The user's locale for the request
 * @param sessionId - The session ID (defaults to 'public' if not authenticated)
 * @param idToken - Optional authentication token
 * @returns Platform data for the current tenant
 * @throws Error if platform data fetch fails
 */
export const getPlatformCached = unstable_cache(
    async (
        locale: string,
        sessionId: string,
        idToken?: string
    ): Promise<TGetPlatformSuccessResponse['data']> => {
        // Create a dedicated tRPC client for this cached call
        // We pass the headers as parameters to avoid accessing dynamic data inside cache
        const headers: Record<string, string> = {
            'Accept-Language': locale,
            'x-eclass-session-id': sessionId,
        };

        if (idToken) {
            headers['Authorization'] = `Bearer ${idToken}`;
        }

        const platformSlug = process.env.NEXT_PUBLIC_E_CLASS_RUNTIME;
        if (platformSlug) {
            headers['x-eclass-runtime'] = platformSlug;
        }

        const client = createTRPCClient<TAppRouter>({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getTRPCUrl(),
                    headers,
                }),
            ],
        });

        // Fetch platform data
        // @ts-ignore
        const response = await client.getPlatform.query({}) as TGetPlatformSuccessResponse;

        // Handle response
        if (!response.success) {
            throw new Error('Failed to load platform data');
        }

        return response.data;
    },
    ['platform-data'], // Cache key prefix
    {
        revalidate: 15 * 60, // 15 minutes in seconds
        tags: ['platform'], // Optional: allows manual revalidation via revalidateTag('platform')
    }
);
