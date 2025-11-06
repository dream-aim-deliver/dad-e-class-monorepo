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

    // DEBUG: Track render count and component lifecycle
    // const renderCount = useRef(0);
    // renderCount.current += 1;
    // // console.log(`[TRPC Provider] 🔄 Render #${renderCount.current}`);

    // // Debug logging for session state
    // // console.log('[TRPC Provider] Session status:', status);
    // // console.log('[TRPC Provider] Session data:', {
    //     hasSession: !!session,
    //     hasUser: !!session?.user,
    //     hasIdToken: !!session?.user?.idToken,
    //     userId: session?.user?.id,
    //     locale
    // });

    // // DEBUG: Track when useMemo dependencies change
    // const prevDeps = useRef({
    //     idToken: session?.user?.idToken,
    //     locale,
    //     status,
    //     platformContext,
    //     runtimeConfig,
    // });

    // useEffect(() => {
    //     const current = {
    //         idToken: session?.user?.idToken,
    //         locale,
    //         status,
    //         platformContext,
    //         runtimeConfig,
    //     };

    //     const changes = [];
    //     if (prevDeps.current.idToken !== current.idToken) changes.push('idToken');
    //     if (prevDeps.current.locale !== current.locale) changes.push('locale');
    //     if (prevDeps.current.status !== current.status) changes.push('status');
    //     if (prevDeps.current.platformContext !== current.platformContext) changes.push('platformContext');
    //     if (prevDeps.current.runtimeConfig !== current.runtimeConfig) changes.push('runtimeConfig');

    //     if (changes.length > 0) {
    //         // console.log('[TRPC Client] 🔄 Dependencies changed:', changes);
    //         // console.log('[TRPC Client] Previous deps:', prevDeps.current);
    //         // console.log('[TRPC Client] Current deps:', current);
    //     }

    //     prevDeps.current = current;
    // }, [session?.user?.idToken, locale, status, platformContext, runtimeConfig]);

    const trpcClient = useMemo(
        () => {
            // DEBUG: Generate unique ID for this client instance
            const clientInstanceId = Math.random().toString(36).slice(2, 9);
            // console.log(`[TRPC Client] 🏗️ Creating NEW TRPC client instance: ${clientInstanceId}`);

            // Build TRPC URL from runtime config
            const trpcUrl = `${runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL}/api/trpc`;

            // console.log('[TRPC Client] Creating new TRPC client with:', {
            //     clientInstanceId,
            //     hasIdToken: !!session?.user?.idToken,
            //     tokenLength: session?.user?.idToken?.length || 0,
            //     locale,
            //     sessionStatus: status,
            //     trpcUrl
            // });

            // Wait for session to be determined (not loading) before setting up auth
            const isSessionReady = status !== 'loading';
            if (!isSessionReady) {
                // console.log('[TRPC Client] ⏳ Session still loading, creating client without auth');
            }

            return trpc.createClient({
                links: [
                    httpLink({ // DEBUG: Using httpLink instead of httpBatchLink to test if batching causes mutation hangs
                        transformer: superjson,
                        url: trpcUrl,
                        headers() {
                            const headers: Record<string, string> = {};

                            // Only add auth header if session is ready and has token
                            if (isSessionReady && session?.user?.idToken) {
                                headers['Authorization'] =
                                    `Bearer ${session.user.idToken}`;
                                // console.log('[TRPC Client Headers] Authorization header added');
                            } else {
                                // console.log('[TRPC Client Headers] No authorization token available', {
                                //     isSessionReady,
                                //     hasSession: !!session,
                                //     hasUser: !!session?.user,
                                //     hasIdToken: !!session?.user?.idToken
                                // });
                            }

                            // Add session ID header (defaults to "public" if no session)
                            headers['x-eclass-session-id'] = session?.user?.sessionId || 'public';
                            // console.log('[TRPC Client Headers] Session ID:', headers['x-eclass-session-id']);

                            // Add locale header
                            if (locale) {
                                headers['Accept-Language'] = locale;
                                // console.log('[TRPC Client Headers] Locale:', locale);
                            }

                            // Add runtime header
                            if (runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME) {
                                headers['x-eclass-runtime'] =
                                    runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME;
                                // console.log('[TRPC Client Headers] Runtime:', runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME);
                            } else {
                                console.warn('[TRPC Headers] ⚠️ Missing runtime header');
                            }

                            // Add dynamic platform context headers (both must be present together)
                            if (platformContext?.platformSlug && platformContext?.platformLanguageCode) {
                                headers['x-eclass-platform'] = platformContext.platformSlug;
                                headers['x-eclass-platform-language'] = platformContext.platformLanguageCode;
                                // console.log('[TRPC Client Headers] Platform context added:', {
                                //     'x-eclass-platform': platformContext.platformSlug,
                                //     'x-eclass-platform-language': platformContext.platformLanguageCode
                                // });
                            } else {
                                // console.log('[TRPC Client Headers] Platform context not complete:', {
                                //     hasPlatformContext: !!platformContext,
                                //     hasSlug: !!platformContext?.platformSlug,
                                //     hasLanguage: !!platformContext?.platformLanguageCode,
                                //     platformContext
                                // });
                            }

                            // console.log('[TRPC Client Headers] Final headers being sent:', {
                            //     ...headers,
                            //     Authorization: headers.Authorization ? '[REDACTED]' : undefined
                            // });

                            return headers;
                        },
                    }),
                ],
            });
        },
        [session?.user?.idToken, locale, status, platformContext, runtimeConfig], // Recreate client when session, locale, platform context, or runtime config changes
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
