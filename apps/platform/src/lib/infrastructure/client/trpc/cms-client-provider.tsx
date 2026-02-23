'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useMemo, useRef, useEffect } from 'react';
import { ThemeProvider } from '@maany_shr/e-class-ui-kit';
import { getQueryClient } from '../../common/utils/get-cms-query-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { trpc } from '../trpc/cms-client';
import { httpBatchLink, TRPCClientError } from '@trpc/client';
import superjson from 'superjson';
import { useSession } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRuntimeConfig } from '../context/runtime-config-context';
import { injectTraceContext } from '../telemetry/trace-context';
import { useSessionExpiration } from '../context/session-expiration-context';

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
    const { triggerExpiration } = useSessionExpiration();

    // Extract stable config values to prevent unnecessary client recreation
    const cmsRestUrl = runtimeConfig.NEXT_PUBLIC_E_CLASS_CMS_REST_URL;
    const platformSlug = runtimeConfig.NEXT_PUBLIC_E_CLASS_RUNTIME;

    // Store token in ref to avoid client recreation on token refresh
    // Initialize with current session value to prevent race condition on first render
    const tokenRef = useRef<string | undefined>(session?.user?.idToken);
    const sessionIdRef = useRef<string | undefined>(session?.user?.sessionId);

    // Update refs synchronously during render to ensure token is available
    // before any child components make tRPC requests
    // This is safe because we're only updating refs, not causing state changes
    tokenRef.current = session?.user?.idToken;
    sessionIdRef.current = session?.user?.sessionId;

    // Store triggerExpiration in ref to avoid stale closure issues
    const triggerExpirationRef = useRef(triggerExpiration);
    useEffect(() => {
        triggerExpirationRef.current = triggerExpiration;
    }, [triggerExpiration]);

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

    // Track locale to detect language change and invalidate cache
    const prevLocaleRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (prevLocaleRef.current !== undefined && prevLocaleRef.current !== locale) {
            console.log('[TRPC] Invalidating query cache - locale changed');
            queryClient.invalidateQueries();
        }
        prevLocaleRef.current = locale;
    }, [locale, queryClient]);

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
