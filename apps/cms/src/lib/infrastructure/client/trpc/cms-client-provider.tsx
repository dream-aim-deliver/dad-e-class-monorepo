'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useEffect, useRef } from 'react';
import {
    getQueryClient,
} from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/cms-client';
import { httpLink } from '@trpc/client'; // DEBUG: Temporarily using httpLink instead of httpBatchLink to test batching issue
import superjson from 'superjson';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRuntimeConfig } from '../context/runtime-config-context';
import { injectTraceContext } from '../telemetry/trace-context';

interface PlatformContext {
    platformSlug: string;
    platformLanguageCode: string;
}

interface ClientProvidersProps {
    children: ReactNode;
    platformContext?: PlatformContext;
}

export default function CMSTRPCClientProviders({
    children,
    platformContext
}: ClientProvidersProps) {
    const queryClient = getQueryClient();
    const { data: session, status } = useSession();
    const locale = useLocale();
    const runtimeConfig = useRuntimeConfig();

    // Extract stable config and context values to prevent unnecessary client recreation
    const cmsRestUrl = runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const runtimeSlug = runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME;
    const platformSlug = platformContext?.platformSlug;
    const platformLanguageCode = platformContext?.platformLanguageCode;

    const trpcClient = useMemo(
        () => {
            // Creating new TRPC client - only when token, locale, or config values change
            const trpcUrl = `${cmsRestUrl}/api/trpc`;

            return trpc.createClient({
                links: [
                    httpLink({ // DEBUG: Using httpLink instead of httpBatchLink to test if batching causes mutation hangs
                        transformer: superjson,
                        url: trpcUrl,
                        headers() {
                            const headers: Record<string, string> = {};

                            // Only add auth header if session has token
                            // Note: status check removed - headers function checks token directly
                            if (session?.user?.idToken) {
                                headers['Authorization'] =
                                    `Bearer ${session.user.idToken}`;
                            } else if (status !== 'loading' && !session?.user?.idToken) {
                                // Log warning only after session is ready
                                console.warn('[TRPC Headers] No authorization token available');
                            }

                            // Add session ID header (defaults to "public" if no session)
                            headers['x-eclass-session-id'] = session?.user?.sessionId || 'public';

                            // Add locale header
                            if (locale) {
                                headers['Accept-Language'] = locale;
                            }

                            // Add runtime header
                            if (runtimeSlug) {
                                headers['x-eclass-runtime'] = runtimeSlug;
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing runtime header');
                            }

                            // Add dynamic platform context headers (both must be present together)
                            if (platformSlug && platformLanguageCode) {
                                headers['x-eclass-platform'] = platformSlug;
                                headers['x-eclass-platform-language'] = platformLanguageCode;
                            }
                            // Inject OpenTelemetry trace context for distributed tracing
                            return injectTraceContext(headers);
                        },
                    }),
                ],
            });
        },
        // Only recreate client when token, locale, or specific config values change
        // Removed 'status' - unnecessary, headers check token directly
        // Replaced 'runtimeConfig' and 'platformContext' with specific values for stability
        [session?.user?.idToken, locale, cmsRestUrl, runtimeSlug, platformSlug, platformLanguageCode],
    );

    // DEBUG: Log which client instance is currently active
    // console.log('[TRPC Client] ✅ Active client ready for use');

    // Handle potential errors in TRPC provider setup
    try {
        return (
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        {process.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools />
                        )}
                    </QueryClientProvider>
                </trpc.Provider>
        );
    } catch (error) {
        console.error('[TRPC Provider] Failed to initialize TRPC provider:', error);
        // Fallback: render children without TRPC (will cause hook errors but app won't crash completely)
        return (
            <>
                <div style={{ color: 'red', padding: '1rem' }}>
                    Connection Error - Check console for details
                </div>
                {children}
            </>
        );
    }
}
