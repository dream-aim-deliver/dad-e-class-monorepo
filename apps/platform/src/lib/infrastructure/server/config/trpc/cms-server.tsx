import 'server-only';
import { TAppRouter } from '@dream-aim-deliver/e-class-cms-rest';
import { makeQueryClient } from '../../../common/utils/get-cms-query-client';
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

export const getQueryClient = cache(makeQueryClient);

/**
 * Creates headers for server-side TRPC requests with authentication and localization
 *
 * Note: We don't call connection() here because the server components that use this
 * client (like layout.tsx) already call getRuntimeConfig() which triggers connection().
 * This enables dynamic rendering for the entire request, allowing us to read runtime
 * environment variables from process.env.
 */
async function createServerHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // Get session from NextAuth
    try {
        const session = await nextAuth.auth();
        if (session?.user?.idToken) {
            headers['Authorization'] = `Bearer ${session.user.idToken}`;
        }
        // Add session ID header (defaults to "public" if no session)
        headers['x-eclass-session-id'] = session?.user?.sessionId || 'public';
    } catch (error) {
        console.warn(
            'Failed to get NextAuth session for server-side TRPC:',
            error,
        );
        // Still set session ID to "public" on error
        headers['x-eclass-session-id'] = 'public';
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

    // Add platform header - read directly from process.env
    // This works at runtime because the parent server component called connection()
    try {
        const platformSlug = process.env.NEXT_PUBLIC_E_CLASS_RUNTIME;
        if (platformSlug) {
            headers['x-eclass-runtime'] = platformSlug;
        }
    } catch (error) {
        console.warn('Failed to get platform name for server-side TRPC:', error);
    }

    // Inject OpenTelemetry trace context for distributed tracing
    // This adds traceparent header if there's an active span
    // Only load OTel API when enabled to prevent side effects
    if (process.env.OTEL_ENABLED === 'true') {
        try {
            const { context, propagation } = await import('@opentelemetry/api');
            propagation.inject(context.active(), headers);
        } catch {
            // Silently fail - tracing should not break functionality
        }
    }

    return headers;
}

/**
 * Gets the TRPC URL from runtime environment variables
 * Reads directly from process.env (works because parent called connection())
 *
 * For server-side requests:
 * - In Kubernetes: Uses E_CLASS_CMS_REST_URL (internal cluster URL) to avoid hairpin NAT
 * - In local dev: Falls back to NEXT_PUBLIC_E_CLASS_CMS_REST_URL (localhost)
 */
function getTRPCUrl(): string {
    const base =
        process.env.E_CLASS_CMS_REST_URL ||
        process.env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL ||
        'http://localhost:5173';
    return `${base}/api/trpc`;
}

/**
 * TRPC client for server-side requests
 * Reads runtime environment variables via process.env
 */
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

/**
 * TRPC query options proxy for server components
 */
export const trpc: ReturnType<typeof createTRPCOptionsProxy<TAppRouter>> =
    createTRPCOptionsProxy({
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
 * Prefetches the specified query options using streaming pattern.
 * Does not await - allows React to stream HTML while queries are in-flight.
 * Pending queries are dehydrated and sent to client via HydrateClient.
 * @template T
 * @param {T} queryOptions - The query options to prefetch.
 */
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
): void {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === 'infinite') {
        void queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}
