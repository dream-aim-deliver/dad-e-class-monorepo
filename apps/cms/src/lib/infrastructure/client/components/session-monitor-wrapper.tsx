'use client';

import { useSession } from 'next-auth/react';
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

    const handleConfirmLogout = useCallback(() => {
        log('User confirmed logout, clearing unsaved changes and signing out');

        if (unsavedChangesState?.clearAllUnsavedChanges) {
            unsavedChangesState.clearAllUnsavedChanges();
        }

        setShowExpirationModal(false);

        const callbackUrl = encodeURIComponent(pathname || '/');
        const returnTo = `/${locale}${loginPath}?callbackUrl=${callbackUrl}&reason=session_expired`;

        log('Redirecting to:', returnTo);

        // Redirect to server-side logout API that handles OIDC logout with id_token_hint
        router.push(`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`);
    }, [unsavedChangesState, pathname, loginPath, locale, router, log]);

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

    // Periodic session check
    useEffect(() => {
        if (status !== 'authenticated') {
            return;
        }

        log(`Setting up periodic session check every ${checkInterval}ms`);

        const interval = setInterval(async () => {
            log('Performing periodic session check');

            try {
                await update();
                log('Session check complete');
            } catch (error) {
                log('Error during session check:', error);
            }
        }, checkInterval);

        return () => {
            log('Clearing periodic session check interval');
            clearInterval(interval);
        };
    }, [status, checkInterval, update, log]);

    return (
        <SessionExpirationModal
            isOpen={showExpirationModal}
            hasUnsavedChanges={hasUnsavedChanges}
            onConfirm={handleConfirmLogout}
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
