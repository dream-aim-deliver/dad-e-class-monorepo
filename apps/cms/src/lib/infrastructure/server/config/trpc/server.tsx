import 'server-only';
import { MockRouter } from '../../../common/mocks/mock-router';
import {
    getTRPCUrl,
    makeQueryClient,
} from '../../../common/utils/get-query-client';
import React, { cache } from 'react';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import {
    createTRPCOptionsProxy,
    TRPCQueryOptions,
} from '@trpc/tanstack-react-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import superjson from 'superjson';

export const getQueryClient = cache(makeQueryClient);

const client = createTRPCClient<MockRouter>({
    links: [
        httpBatchLink({
            transformer: superjson,
            url: getTRPCUrl(),
        }),
    ],
});

export const trpc = createTRPCOptionsProxy({
    client: client,
    queryClient: getQueryClient,
});

/**
 * Hydrates the client with the provided state.
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the hydration boundary.
 * @returns {JSX.Element} The HydrationBoundary component with the provided children.
 */
export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {props.children}
        </HydrationBoundary>
    );
}

/**
 * Prefetches the specified query options.
 * @template T
 * @param {T} queryOptions - The query options to prefetch.
 */
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === 'infinite') {
        await queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        await queryClient.prefetchQuery(queryOptions);
    }
}
