'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useRef, useEffect } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import { getQueryClient } from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/cms-client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRuntimeConfig } from '../context/runtime-config-context';
import { injectTraceContext } from '../telemetry/trace-context';

interface ClientProvidersProps {
    children: ReactNode;
}

export default function CMSTRPCClientProviders({
    children,
}: ClientProvidersProps) {
    const queryClient = getQueryClient();
    const { data: session, status } = useSession();
    const locale = useLocale();
    const runtimeConfig = useRuntimeConfig();

    // Extract stable config values to prevent unnecessary client recreation
    const cmsRestUrl = runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const platformSlug = runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME;

    // Store token in ref to avoid client recreation on token refresh
    const tokenRef = useRef<string | undefined>(undefined);
    const sessionIdRef = useRef<string | undefined>(undefined);

    // Update refs when session changes (doesn't trigger client recreation)
    useEffect(() => {
        tokenRef.current = session?.user?.idToken;
        sessionIdRef.current = session?.user?.sessionId;
    }, [session?.user?.idToken, session?.user?.sessionId]);

    // Track user ID to detect user change and clear cache
    const prevUserIdRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        const currentUserId = session?.user?.id;

        // Clear cache on logout (user -> no user) or user change
        if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== currentUserId) {
            console.log('[TRPC] Clearing query cache - user changed');
            queryClient.clear();
        }

        prevUserIdRef.current = currentUserId;
    }, [session?.user?.id, queryClient]);

    const trpcClient = useMemo(
        () => {
            // Creating new TRPC client - only when locale or config URLs change
            // Token is stored in ref to avoid recreation on token refresh
            const trpcUrl = `${cmsRestUrl}/api/trpc`;

            return trpc.createClient({
                links: [
                    httpBatchLink({
                        transformer: superjson,
                        url: trpcUrl,
                        headers() {
                            const headers: Record<string, string> = {};

                            // Read token from ref (updated via useEffect, doesn't trigger client recreation)
                            if (tokenRef.current) {
                                headers['Authorization'] = `Bearer ${tokenRef.current}`;
                            }

                            // Add session ID header (defaults to "public" if no session)
                            headers['x-eclass-session-id'] = sessionIdRef.current || 'public';

                            // Add locale header
                            if (locale) {
                                headers['Accept-Language'] = locale;
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing Accept-Language header');
                            }

                            // Add platform header
                            if (platformSlug) {
                                headers['x-eclass-runtime'] = platformSlug;
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing platform header');
                            }

                            // Inject OpenTelemetry trace context for distributed tracing
                            return injectTraceContext(headers);
                        },
                    }),
                ],
            });
        },
        // Token NOT in deps - stored in ref to prevent client recreation on token refresh
        // Client only recreates when locale or config URLs change
        [locale, cmsRestUrl, platformSlug],
    );

    // Handle potential errors in TRPC provider setup
    try {
        return (
            <ThemeProvider defaultTheme={runtimeConfig.defaultTheme}>
                <trpc.Provider client={trpcClient} queryClient={queryClient}>
                    <QueryClientProvider client={queryClient}>
                        {children}
                        {process.env.NODE_ENV === 'development' && (
                            <ReactQueryDevtools />
                        )}
                    </QueryClientProvider>
                </trpc.Provider>
            </ThemeProvider>
        );
    } catch (error) {
        console.error('[TRPC Provider] Failed to initialize TRPC provider:', error);
        // Fallback: render children without TRPC (will cause hook errors but app won't crash completely)
        return (
            <ThemeProvider defaultTheme={runtimeConfig.defaultTheme}>
                <div style={{ color: 'red', padding: '1rem' }}>
                    TRPC Provider Error - Check console for details
                </div>
                {children}
            </ThemeProvider>
        );
    }
}
