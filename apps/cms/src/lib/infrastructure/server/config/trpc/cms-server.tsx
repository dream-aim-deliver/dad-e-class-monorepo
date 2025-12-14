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

interface PlatformContext {
    platformSlug: string;
    platformLanguageCode: string;
}

export const getQueryClient = cache(makeQueryClient);

/**
 * Creates headers for server-side TRPC requests with authentication and localization
 */
async function createServerHeaders(platformContext?: PlatformContext): Promise<Record<string, string>> {
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

    // Add runtime header
    try {
        const runtime = env.NEXT_PUBLIC_E_CLASS_RUNTIME;
        if (runtime) {
            headers['x-eclass-runtime'] = runtime;
        }
    } catch (error) {
        console.warn('Failed to get runtime for server-side TRPC:', error);
    }

    // Add dynamic platform context headers (both must be present together)
    if (platformContext?.platformSlug && platformContext?.platformLanguageCode) {
        headers['x-eclass-platform'] = platformContext.platformSlug;
        headers['x-eclass-platform-language'] = platformContext.platformLanguageCode;

        console.log('[createServerHeaders] Added platform context headers:', {
            'x-eclass-platform': platformContext.platformSlug,
            'x-eclass-platform-language': platformContext.platformLanguageCode
        });
    } else {
        console.log('[createServerHeaders] Platform context not complete:', {
            hasSlug: !!platformContext?.platformSlug,
            hasLanguage: !!platformContext?.platformLanguageCode,
            platformContext
        });
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

    console.log('[createServerHeaders] Final headers:', headers);
    return headers;
}

/**
 * Creates a TRPC client with optional platform context headers
 */
function createTRPCClientWithContext(platformContext?: PlatformContext) {
    return createTRPCClient<TAppRouter>({
        links: [
            httpBatchLink({
                transformer: superjson,
                url: getTRPCUrl(),
                async headers() {
                    return await createServerHeaders(platformContext);
                },
            }),
        ],
    });
}

const client = createTRPCClientWithContext();

/**
 * @deprecated Use getServerTRPC() instead for better platform support
 * Direct trpc export - kept for backward compatibility
 */
const trpc: ReturnType<typeof createTRPCOptionsProxy<TAppRouter>> = createTRPCOptionsProxy({
    client: client,
    queryClient: getQueryClient,
});

/**
 * Creates a TRPC proxy with optional platform context
 */
export function getTRPCProxy(platformContext?: PlatformContext): ReturnType<typeof createTRPCOptionsProxy<TAppRouter>> {
    if (!platformContext) {
        return trpc;
    }

    const platformClient = createTRPCClientWithContext(platformContext);
    return createTRPCOptionsProxy<TAppRouter>({
        client: platformClient,
        queryClient: getQueryClient,
    });
}

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
 * Note: For platform-aware prefetching, use getTRPCProxy(platformContext) directly
 * to ensure platform headers are included in the request.
 * @template T
 * @param {T} queryOptions - The query options to prefetch.
 */
export async function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
    queryOptions: T,
) {
    const queryClient = getQueryClient();
    if (queryOptions.queryKey[1]?.type === 'infinite') {
         queryClient.prefetchInfiniteQuery(queryOptions as any);
    } else {
         queryClient.prefetchQuery(queryOptions);
    }
}

/**
 * Helper to extract platform context from Next.js route parameters
 */
export function extractPlatformContext(params: {
    platform_slug?: string;
    platform_locale?: string;
}): PlatformContext | null {
    const slug = params.platform_slug;
    const locale = params.platform_locale;

    if (slug && locale) {
        return {
            platformSlug: slug,
            platformLanguageCode: locale,
        };
    }
    return null;
}

/**
 * Universal server-side TRPC access function.
 * Automatically handles platform context when provided.
 *
 * @param params - Optional route parameters containing platform_slug and platform_locale
 * @returns TRPC proxy with appropriate headers (platform-aware or default)
 *
 * @example
 * // In platform routes:
 * const trpc = getServerTRPC(await params);
 *
 * // In regular routes:
 * const trpc = getServerTRPC();
 */
export function getServerTRPC(params?: {
    platform_slug?: string;
    platform_locale?: string;
}): ReturnType<typeof createTRPCOptionsProxy<TAppRouter>> {
    if (!params) {
        return trpc;
    }

    const platformContext = extractPlatformContext(params);
    return platformContext ? getTRPCProxy(platformContext) : trpc;
}

// Export PlatformContext type for external use
export type { PlatformContext };
