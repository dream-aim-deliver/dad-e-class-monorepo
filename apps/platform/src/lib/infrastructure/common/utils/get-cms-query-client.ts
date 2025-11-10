import {
    QueryClient,
    isServer,
    defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import superjson from 'superjson';

export function getTRPCUrl() {
    const serverUrl = process.env.E_CLASS_CMS_REST_URL;
    const publicUrl = process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const fallbackUrl = 'http://localhost:5173';

    const base = serverUrl || publicUrl || fallbackUrl;

    console.log('[getTRPCUrl] Environment check:', {
        hasServerUrl: !!serverUrl,
        serverUrl: serverUrl || 'NOT SET',
        hasPublicUrl: !!publicUrl,
        publicUrl: publicUrl || 'NOT SET',
        selectedUrl: base,
        fallbackUsed: !serverUrl && !publicUrl
    });

    return `${base}/api/trpc`;
}

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
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
