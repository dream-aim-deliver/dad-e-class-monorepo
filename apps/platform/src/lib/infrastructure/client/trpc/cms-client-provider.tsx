'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
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

    const trpcClient = useMemo(
        () => {
            // Creating new TRPC client - only when token, locale, or config URLs change
            const trpcUrl = `${cmsRestUrl}/api/trpc`;

            return trpc.createClient({
                links: [
                    httpBatchLink({
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
                                console.warn('[TRPC Headers] ⚠️ Missing Authorization header - no idToken found', {
                                    hasSession: !!session,
                                    hasUser: !!session?.user,
                                    sessionStatus: status,
                                    isAuthenticated: status === 'authenticated'
                                });
                            }

                            // Add session ID header (defaults to "public" if no session)
                            headers['x-eclass-session-id'] = session?.user?.sessionId || 'public';

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
        // Only recreate client when token or locale changes
        // Removed 'status' - unnecessary, headers check token directly
        // Replaced 'runtimeConfig' with specific values for stability
        [session?.user?.idToken, locale, cmsRestUrl, platformSlug],
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
