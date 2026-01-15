'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useEffect, useRef } from 'react';
import {
    getQueryClient,
} from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/cms-client';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import superjson from 'superjson';
import { useSessionExpiration } from '../context/session-expiration-context';
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
    const { triggerExpiration } = useSessionExpiration();

    // Extract stable config and context values to prevent unnecessary client recreation
    const cmsRestUrl = runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const runtimeSlug = runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME;
    const platformSlug = platformContext?.platformSlug;
    const platformLanguageCode = platformContext?.platformLanguageCode;

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

    // Store triggerExpiration in ref to avoid stale closure issues
    const triggerExpirationRef = useRef(triggerExpiration);
    useEffect(() => {
        triggerExpirationRef.current = triggerExpiration;
    }, [triggerExpiration]);

    // Track if we've already triggered expiration to prevent duplicate triggers
    const hasTriggeredExpirationRef = useRef(false);

    // Subscribe to query and mutation cache to detect auth-related errors
    useEffect(() => {
        // Helper to check if error is auth-related (token expired, invalid, etc.)
        const isAuthError = (error: unknown): boolean => {
            if (error instanceof TRPCClientError) {
                // Check for UNAUTHORIZED code in error data
                const code = error.data?.code;
                if (code === 'UNAUTHORIZED' || code === 'FORBIDDEN') {
                    return true;
                }
                // Check HTTP status for 401 (Unauthorized) or 403 (Forbidden)
                const httpStatus = error.data?.httpStatus;
                if (httpStatus === 401 || httpStatus === 403) {
                    return true;
                }
                // Check for specific auth-related error messages
                const message = error.message?.toLowerCase() || '';
                if (
                    message.includes('invalid context type') ||
                    message.includes('token expired') ||
                    message.includes('unauthorized') ||
                    message.includes('invalid token') ||
                    message.includes('jwt expired')
                ) {
                    return true;
                }
            }
            return false;
        };

        // Handle error and trigger expiration if auth-related
        const handleError = (error: unknown) => {
            if (isAuthError(error) && !hasTriggeredExpirationRef.current) {
                console.log('[TRPC] Auth error detected, triggering session expiration');
                hasTriggeredExpirationRef.current = true;
                triggerExpirationRef.current();
            }
        };

        // Subscribe to query cache events
        const queryUnsubscribe = queryClient.getQueryCache().subscribe((event) => {
            if (event.type === 'updated' && event.query.state.status === 'error') {
                handleError(event.query.state.error);
            }
        });

        // Subscribe to mutation cache events
        const mutationUnsubscribe = queryClient.getMutationCache().subscribe((event) => {
            if (event.type === 'updated' && event.mutation?.state.status === 'error') {
                handleError(event.mutation.state.error);
            }
        });

        return () => {
            queryUnsubscribe();
            mutationUnsubscribe();
        };
    }, [queryClient]);

    // Reset expiration trigger flag when user logs in again
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.idToken) {
            hasTriggeredExpirationRef.current = false;
        }
    }, [status, session?.user?.idToken]);

    const trpcClient = useMemo(
        () => {
            // Creating new TRPC client - only when locale or config values change
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
        // Token NOT in deps - stored in ref to prevent client recreation on token refresh
        // Client only recreates when locale or config values change
        [locale, cmsRestUrl, runtimeSlug, platformSlug, platformLanguageCode],
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
