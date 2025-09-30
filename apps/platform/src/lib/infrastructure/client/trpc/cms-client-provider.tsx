'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import {
    getQueryClient,
    getTRPCUrl,
} from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/cms-client';
import { httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import env from '../config/env';

interface ClientProvidersProps {
    children: ReactNode;
}

export default function CMSTRPCClientProviders({
    children,
}: ClientProvidersProps) {
    const queryClient = getQueryClient();
    const { data: session, status } = useSession();
    const locale = useLocale();

    // Debug logging for session state

    const trpcClient = useMemo(
        () => {
            // Creating new TRPC client

            // Wait for session to be determined (not loading) before setting up auth
            const isSessionReady = status !== 'loading';

            return trpc.createClient({
                links: [
                    httpBatchLink({
                        transformer: superjson,
                        url: getTRPCUrl(),
                        headers() {
                            const headers: Record<string, string> = {};

                            // Only add auth header if session is ready and has token
                            if (isSessionReady && session?.user?.idToken) {
                                headers['Authorization'] =
                                    `Bearer ${session.user.idToken}`;
                                // Authorization header added
                            } else if (!session?.user?.idToken) {
                                console.warn('[TRPC Headers] ⚠️ Missing Authorization header - no idToken found', {
                                    hasSession: !!session,
                                    hasUser: !!session?.user,
                                    sessionStatus: status,
                                    isAuthenticated: status === 'authenticated'
                                });
                            }

                            // Add locale header
                            if (locale) {
                                headers['Accept-Language'] = locale;
                                // Accept-Language header added
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing Accept-Language header');
                            }

                            // Add platform header
                            if (env.NEXT_PUBLIC_E_CLASS_RUNTIME) {
                                headers['x-eclass-runtime'] =
                                    env.NEXT_PUBLIC_E_CLASS_RUNTIME;
                                console.log('[TRPC Headers] ✅ Platform header added:', env.NEXT_PUBLIC_E_CLASS_RUNTIME);
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing platform header');
                            }

                            // Final headers
                            return headers;
                        },
                    }),
                ],
            });
        },
        [session?.user?.idToken, locale, status], // Recreate client when session or locale changes
    );

    // Handle potential errors in TRPC provider setup
    try {
        return (
            <ThemeProvider>
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
            <ThemeProvider>
                <div style={{ color: 'red', padding: '1rem' }}>
                    TRPC Provider Error - Check console for details
                </div>
                {children}
            </ThemeProvider>
        );
    }
}
