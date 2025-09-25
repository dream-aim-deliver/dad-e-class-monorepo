'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo } from 'react';
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

    // Debug logging for session state
    console.log('[TRPC Provider] Session status:', status);
    console.log('[TRPC Provider] Session data:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        hasIdToken: !!session?.user?.idToken,
        userId: session?.user?.id,
        locale
    });

    const trpcClient = useMemo(
        () => {
            console.log('[TRPC Client] Creating new TRPC client with:', {
                hasIdToken: !!session?.user?.idToken,
                tokenLength: session?.user?.idToken?.length || 0,
                locale,
                sessionStatus: status
            });

            // Wait for session to be determined (not loading) before setting up auth
            const isSessionReady = status !== 'loading';
            if (!isSessionReady) {
                console.log('[TRPC Client] ⏳ Session still loading, creating client without auth');
            }

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
                            }

                            // Add locale header
                            if (locale) {
                                headers['Accept-Language'] = locale;
                            }

                            // Add runtime header
                            if (env.NEXT_PUBLIC_E_CLASS_RUNTIME) {
                                headers['x-eclass-runtime'] =
                                    env.NEXT_PUBLIC_E_CLASS_RUNTIME;
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing runtime header');
                            }

                            // Add dynamic platform context headers (both must be present together)
                            if (platformContext?.platformSlug && platformContext?.platformLanguageCode) {
                                headers['x-eclass-platform-runtime'] = platformContext.platformSlug;
                                headers['x-eclass-platform-language'] = platformContext.platformLanguageCode;
                            }
                            return headers;
                        },
                    }),
                ],
            });
        },
        [session?.user?.idToken, locale, status, platformContext], // Recreate client when session, locale, or platform context changes
    );

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
