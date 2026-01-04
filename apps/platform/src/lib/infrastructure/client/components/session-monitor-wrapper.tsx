'use client';

import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
    UnsavedChangesProvider,
    useUnsavedChanges,
    SessionExpirationModal,
} from '@maany_shr/e-class-ui-kit';
import { TLocale } from '@maany_shr/e-class-translations';
import { isPurelyPublicRoute, isMixedRoute } from '../../common/utils/public-routes';

interface SessionMonitorWrapperProps {
    children: React.ReactNode;
    locale: TLocale;
}

/**
 * Internal session monitor component for Platform app
 */
function SessionMonitor({ locale }: { locale: TLocale }) {
    const { data: session, status, update } = useSession();
    const pathname = usePathname();
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
        log('User confirmed logout, clearing unsaved changes and signing out');

        if (unsavedChangesState?.clearAllUnsavedChanges) {
            unsavedChangesState.clearAllUnsavedChanges();
        }

        setShowExpirationModal(false);

        log('Redirecting to homepage');

        // Redirect to homepage instead of login page to avoid auto-login issue
        await signOut({ callbackUrl: `/${locale}/` });
    }, [unsavedChangesState, locale, log]);

    const handleDismiss = useCallback(async () => {
        log('User dismissed modal, continuing as visitor');

        // Clear the expired session to prevent modal from re-triggering
        await signOut({ redirect: false });

        setShowExpirationModal(false);
        // Reset trigger so we don't show modal again on next render
        setHasTriggeredCheck(false);
    }, [log]);

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
