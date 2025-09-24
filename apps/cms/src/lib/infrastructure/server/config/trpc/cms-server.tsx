import 'server-only';
import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import {
    getTRPCUrl,
    makeQueryClient,
} from '../../../common/utils/get-cms-query-client';
import React, { cache } from 'react';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import {
    createTRPCOptionsProxy,
    TRPCQueryOptions,
} from '@trpc/tanstack-react-query';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import superjson from 'superjson';
import nextAuth from '../auth/next-auth.config';
import { getLocale } from 'next-intl/server';
import env from '../env';

export const getQueryClient = cache(makeQueryClient);

/**
 * Creates headers for server-side TRPC requests with authentication and localization
 */
async function createServerHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // Get session from NextAuth
    try {
        const session = await nextAuth.auth();
        if (session?.user?.idToken) {
            headers['Authorization'] = `Bearer ${session.user.idToken}`;
        }
    } catch (error) {
        console.warn(
            'Failed to get NextAuth session for server-side TRPC:',
            error,
        );
    }

    // Add locale header
    try {
        const locale = await getLocale();
        if (locale) {
            headers['Accept-Language'] = locale;
        }
    } catch (error) {
        console.warn('Failed to get locale for server-side TRPC:', error);
    }

    // Add platform header
    try {
        const platformName = env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME;
        if (platformName) {
            headers['x-eclass-runtime'] = platformName;
        }
    } catch (error) {
        console.warn('Failed to get platform name for server-side TRPC:', error);
    }
    return headers;
}

const client = createTRPCClient<TAppRouter>({
    links: [
        httpBatchLink({
            transformer: superjson,
            url: getTRPCUrl(),
            async headers() {
                return await createServerHeaders();
            },
        }),
    ],
});

export const trpc: ReturnType<typeof createTRPCOptionsProxy<TAppRouter>> = createTRPCOptionsProxy({
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
