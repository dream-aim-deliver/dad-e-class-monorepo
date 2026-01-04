'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
    UnsavedChangesProvider,
    useUnsavedChanges,
    SessionExpirationModal,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';

interface SessionMonitorWrapperProps {
    children: React.ReactNode;
    locale: TLocale;
}

/**
 * Internal session monitor component for CMS app
 */
function SessionMonitor({ locale }: { locale: TLocale }) {
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

    const handleConfirmLogout = useCallback(async () => {
        log('User chose to stay logged in, attempting to refresh token');

        try {
            // Try to refresh the token - if Auth0 session is valid, this will succeed
            await update();
            log('Token refresh successful, user stays logged in');
            setShowExpirationModal(false);
            setHasTriggeredCheck(false); // Reset so future expiry is detected
        } catch (error) {
            log('Token refresh failed:', error);
            // Refresh failed - redirect to login for re-authentication
            if (unsavedChangesState?.clearAllUnsavedChanges) {
                unsavedChangesState.clearAllUnsavedChanges();
            }
            setShowExpirationModal(false);
            await signOut({ redirect: false });
            router.push(`/${locale}${loginPath}`);
        }
    }, [update, unsavedChangesState, loginPath, locale, router, log]);

    const handleDismiss = useCallback(async () => {
        log('User chose to logout completely (federated logout)');

        if (unsavedChangesState?.clearAllUnsavedChanges) {
            unsavedChangesState.clearAllUnsavedChanges();
        }

        setShowExpirationModal(false);

        // Step 1: Attempt to refresh token to get valid id_token_hint for federated logout
        // This makes federated logout smoother (no Auth0 confirmation page)
        // If refresh fails, we still proceed with federated logout - the API route
        // handles missing/invalid id_token_hint gracefully
        let tokenRefreshed = false;
        try {
            await update();
            tokenRefreshed = true;
            log('Token refreshed successfully');
        } catch (error) {
            // This is expected if Auth0 session is already expired
            // We still proceed with federated logout to ensure clean state
            log('Token refresh failed (Auth0 session may be expired), proceeding with federated logout');
        }

        // Step 2: Logout locally (clear NextAuth session)
        await signOut({ redirect: false });
        log('Local session cleared');

        // Step 3: Federated logout - clears Auth0 session completely
        // Even without valid id_token_hint, Auth0 will still process the logout
        // (may show confirmation page if configured in Auth0 dashboard)
        const returnTo = `/${locale}${loginPath}`;
        log(`Redirecting to federated logout (token refreshed: ${tokenRefreshed})`);
        router.push(`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`);
    }, [update, unsavedChangesState, loginPath, locale, router, log]);

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
                    log('Token refresh failed, showing expiration modal');
                    setShowExpirationModal(true);
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
    // CMS is fully protected, so always show modal on expiry
    useEffect(() => {
        // Skip if already triggered to prevent re-showing modal after user interaction
        if (status !== 'authenticated' || !session?.expires || hasTriggeredCheck) return;

        const expiresAt = new Date(session.expires).getTime();
        const now = Date.now();
        const timeUntilExpiry = expiresAt - now;

        // If already expired or very close, show modal immediately
        if (timeUntilExpiry <= 0) {
            log('Session already expired based on session.expires');
            setShowExpirationModal(true);
            setHasTriggeredCheck(true);
            return;
        }

        // Set timeout to show modal 30 seconds before expiry
        const checkTime = Math.max(timeUntilExpiry - 30000, 1000);
        log(`Session expires in ${Math.round(timeUntilExpiry / 1000)}s, setting timeout for ${Math.round(checkTime / 1000)}s`);

        const timeout = setTimeout(() => {
            log('Token expiry time reached, showing modal');
            setShowExpirationModal(true);
            setHasTriggeredCheck(true);
        }, checkTime);

        return () => clearTimeout(timeout);
    }, [session?.expires, status, hasTriggeredCheck, log]);

    return (
        <SessionExpirationModal
            isOpen={showExpirationModal}
            hasUnsavedChanges={hasUnsavedChanges}
            onConfirm={handleConfirmLogout}
            allowDismiss={false}
            onDismiss={handleDismiss}
            locale={locale}
        />
    );
}

/**
 * Wrapper component that provides session monitoring and unsaved changes tracking
 * for the CMS application.
 *
 * This component:
 * - Wraps children with UnsavedChangesProvider
 * - Includes session monitoring for auto-logout functionality
 * - Checks for unsaved changes before logout
 */
export function SessionMonitorWrapper({ children, locale }: SessionMonitorWrapperProps) {
    return (
        <UnsavedChangesProvider>
            <SessionMonitor locale={locale} />
            {children}
        </UnsavedChangesProvider>
    );
}
