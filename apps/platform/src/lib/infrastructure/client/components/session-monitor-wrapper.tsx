'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
    UnsavedChangesProvider,
    useUnsavedChanges,
    SessionExpirationModal,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { isPurelyPublicRoute, isMixedRoute } from '../../common/utils/public-routes';
import { SessionExpirationProvider } from '../context/session-expiration-context';

interface SessionMonitorWrapperProps {
    children: React.ReactNode;
    locale: TLocale;
}

interface SessionMonitorProps {
    locale: TLocale;
    externalTrigger: boolean;
    onExternalTriggerHandled: () => void;
}

/**
 * Internal session monitor component for Platform app
 */
function SessionMonitor({ locale, externalTrigger, onExternalTriggerHandled }: SessionMonitorProps) {
    const { data: session, status, update } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [showExpirationModal, setShowExpirationModal] = useState(false);
    const [hasTriggeredCheck, setHasTriggeredCheck] = useState(false);
    const unsavedChangesState = useUnsavedChanges();
    const hasUnsavedChanges = unsavedChangesState?.hasUnsavedChanges ?? false;

    const debug = process.env.NODE_ENV === 'development';
    const checkInterval = 300000; // 5 minutes (reduced from 60s to minimize server load and false positives)
    const loginPath = '/auth/login';

    const log = useCallback((...args: any[]) => {
        if (debug) {
            console.log('[SessionMonitor]', ...args);
        }
    }, [debug]);

    // Handle external trigger from tRPC UNAUTHORIZED errors
    useEffect(() => {
        if (externalTrigger && !showExpirationModal) {
            log('External expiration trigger received (tRPC UNAUTHORIZED)');
            // Only show modal on non-public routes
            if (!isPurelyPublicRoute(pathname || '')) {
                setShowExpirationModal(true);
            } else {
                log('Skipping modal on purely public route');
            }
            onExternalTriggerHandled();
        }
    }, [externalTrigger, showExpirationModal, pathname, log, onExternalTriggerHandled]);

    const handleConfirmLogout = useCallback(async () => {
        log('User confirmed login, clearing session and redirecting to login');

        if (unsavedChangesState?.clearAllUnsavedChanges) {
            unsavedChangesState.clearAllUnsavedChanges();
        }

        setShowExpirationModal(false);

        // Clear the expired session without redirect
        await signOut({ redirect: false });

        // Redirect to login page with current path as callbackUrl
        // so user returns to the same page after re-authentication
        const callbackUrl = encodeURIComponent(pathname || `/${locale}/`);
        log('Redirecting to login with callbackUrl:', pathname);
        router.push(`/${locale}/auth/login?callbackUrl=${callbackUrl}`);
    }, [unsavedChangesState, locale, pathname, router, log]);

    const handleDismiss = useCallback(async () => {
        // On protected routes, "dismiss" means logout and go to home
        // On mixed routes, "dismiss" means continue as visitor (stay on page)
        const isProtected = !isMixedRoute(pathname || '') && !isPurelyPublicRoute(pathname || '');

        if (isProtected) {
            log('User chose to logout from protected route, redirecting to home');
            await signOut({ redirect: false });
            setShowExpirationModal(false);
            router.push(`/${locale}/`);
        } else {
            log('User dismissed modal, continuing as visitor');
            await signOut({ redirect: false });
            setShowExpirationModal(false);
            // Refresh the route to re-render server components with unauthenticated view
            router.refresh();
        }
    }, [log, pathname, locale, router]);

    // Check if current route allows dismissing the modal
    const allowDismiss = isMixedRoute(pathname || '');

    // Monitor session for errors
    useEffect(() => {
        if (status === 'loading') {
            log('Session loading...');
            return;
        }

        if (status === 'unauthenticated') {
            log('User not authenticated');
            return;
        }

        if (status === 'authenticated' && session && !hasTriggeredCheck) {
            const sessionError = (session as any).error;

            if (sessionError) {
                log('Session error detected:', sessionError);

                if (sessionError === 'RefreshAccessTokenError' || sessionError === 'RefreshTokenMissing') {
                    // Skip modal on purely public pages - session expiry is irrelevant there
                    if (!isPurelyPublicRoute(pathname || '')) {
                        log('Token refresh failed, showing expiration modal');
                        setShowExpirationModal(true);
                    } else {
                        log('Token refresh failed on purely public page, skipping modal');
                    }
                    setHasTriggeredCheck(true);
                }
            } else {
                log('Session valid');
                setHasTriggeredCheck(false);
            }
        }
    }, [session, status, hasTriggeredCheck, log]);

    // Periodic session check - only when page is visible (performance optimization)
    useEffect(() => {
        if (status !== 'authenticated') {
            return;
        }

        let interval: NodeJS.Timeout | null = null;

        const startPolling = () => {
            if (interval) return;
            log(`Starting periodic session check every ${checkInterval}ms`);
            interval = setInterval(async () => {
                log('Performing periodic session check');
                try {
                    await update();
                    log('Session check complete');
                } catch (error) {
                    log('Error during session check:', error);
                }
            }, checkInterval);
        };

        const stopPolling = () => {
            if (interval) {
                log('Stopping periodic session check (page hidden)');
                clearInterval(interval);
                interval = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                // Immediate check when tab becomes visible, then resume polling
                log('Page became visible, checking session');
                update().catch(err => log('Error on visibility check:', err));
                startPolling();
            } else {
                stopPolling();
            }
        };

        // Start polling if page is currently visible
        if (document.visibilityState === 'visible') {
            startPolling();
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [status, checkInterval, update, log]);

    // Precise expiry detection - set timeout to check exactly when token expires
    // Behavior differs by route type:
    // - Mixed routes: Show modal (user can re-login or continue as visitor)
    // - Protected routes: Auto-refresh silently
    // - Public routes: Ignore (session irrelevant)
    useEffect(() => {
        if (status !== 'authenticated' || !session?.expires) return;

        const expiresAt = new Date(session.expires).getTime();
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        const handleExpiry = () => {
            // Skip on purely public routes - session expiry doesn't matter
            if (isPurelyPublicRoute(pathname || '')) {
                log('Session expired on purely public route, ignoring');
                return;
            }

            // Show modal on both mixed and protected routes (no auto-refresh)
            // - Mixed routes: User can "Stay logged in" or "Continue as visitor"
            // - Protected routes: User can "Stay logged in" or "Logout" (→ home)
            log('Session expired, showing modal');
            setShowExpirationModal(true);
        };

        // If already expired or very close, handle immediately
        if (timeUntilExpiry <= 0) {
            log('Session already expired based on session.expires');
            handleExpiry();
            return;
        }

        // Set timeout to handle expiry 30 seconds before it happens
        const checkTime = Math.max(timeUntilExpiry - 30000, 1000);
        log(`Session expires in ${Math.round(timeUntilExpiry / 1000)}s, setting timeout for ${Math.round(checkTime / 1000)}s`);

        const timeout = setTimeout(() => {
            log('Token expiry time reached');
            handleExpiry();
        }, checkTime);

        return () => clearTimeout(timeout);
    }, [session?.expires, status, update, log, pathname]);

    return (
        <SessionExpirationModal
            isOpen={showExpirationModal}
            hasUnsavedChanges={hasUnsavedChanges}
            onConfirm={handleConfirmLogout}
            allowDismiss={allowDismiss}
            onDismiss={handleDismiss}
            locale={locale}
        />
    );
}

/**
 * Wrapper component that provides session monitoring and unsaved changes tracking
 * for the Platform application.
 *
 * This component:
 * - Wraps children with UnsavedChangesProvider
 * - Provides SessionExpirationContext for tRPC error handling
 * - Includes session monitoring for auto-logout functionality
 * - Checks for unsaved changes before logout
 */
export function SessionMonitorWrapper({ children, locale }: SessionMonitorWrapperProps) {
    // Track external triggers from tRPC UNAUTHORIZED errors
    const [externalTrigger, setExternalTrigger] = useState(false);

    // Callback for tRPC client to trigger session expiration
    const handleExpiration = useCallback(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('[SessionMonitorWrapper] Expiration triggered from tRPC UNAUTHORIZED');
        }
        setExternalTrigger(true);
    }, []);

    // Reset the trigger after it's been handled
    const handleExternalTriggerHandled = useCallback(() => {
        setExternalTrigger(false);
    }, []);

    return (
        <SessionExpirationProvider onExpiration={handleExpiration}>
            <UnsavedChangesProvider>
                <SessionMonitor
                    locale={locale}
                    externalTrigger={externalTrigger}
                    onExternalTriggerHandled={handleExternalTriggerHandled}
                />
                {children}
            </UnsavedChangesProvider>
        </SessionExpirationProvider>
    );
}
