import {
    QueryClient,
    isServer,
    defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import superjson from 'superjson';

/**
 * Gets the TRPC URL for cms-rest connections
 *
 * For server-side requests:
 * - In Kubernetes: Uses E_CLASS_CMS_REST_URL (internal cluster URL) to avoid hairpin NAT
 * - In local dev: Falls back to NEXT_PUBLIC_E_CLASS_CMS_REST_URL (localhost)
 *
 * For client-side requests:
 * - E_CLASS_CMS_REST_URL is not available in browser, so uses NEXT_PUBLIC_E_CLASS_CMS_REST_URL
 */
export function getTRPCUrl() {
    const serverUrl = process.env.E_CLASS_CMS_REST_URL;
    const publicUrl = process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const fallbackUrl = 'http://localhost:5173';

    const base = serverUrl || publicUrl || fallbackUrl;

    return `${base}/api/trpc`;
}

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Disable automatic refetch on window focus to reduce unnecessary requests
                refetchOnWindowFocus: false,
                // Consider data stale after 2 minutes
                staleTime: 2 * 60 * 1000,
                // Refetch when component mounts if data is stale
                refetchOnMount: true,
                // Refetch when network reconnects
                refetchOnReconnect: true,
                // Only retry failed queries once
                retry: 1,
            },
            dehydrate: {
                serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) => {
                    return (
                        defaultShouldDehydrateQuery(query) ||
                        query.state.status === 'pending'
                    );
                },
            },
            hydrate: {
                deserializeData: superjson.deserialize,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}
