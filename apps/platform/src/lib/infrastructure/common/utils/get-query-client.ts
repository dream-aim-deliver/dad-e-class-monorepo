import {
    QueryClient,
    isServer,
    defaultShouldDehydrateQuery,
} from '@tanstack/react-query';
import superjson from 'superjson';
import env from '../../client/config/env';

export function getTRPCUrl() {
    const base = env.NEXT_PUBLIC_APP_URL;
    return `${base}/api/trpc`;
}

export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            // TODO: define default options for queries
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
