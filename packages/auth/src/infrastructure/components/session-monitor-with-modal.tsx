'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export interface SessionMonitorWithModalProps {
  /**
   * Interval in milliseconds to check session validity (default: 60000 = 60 seconds)
   */
  checkInterval?: number;

  /**
   * Path to redirect to after session expiration (default: '/auth/login')
   */
  loginPath?: string;

  /**
   * Current locale for translations
   */
  locale: string;

  /**
   * SessionExpirationModal component (passed as prop to avoid direct dependency)
   */
  SessionExpirationModal: React.ComponentType<{
    isOpen: boolean;
    hasUnsavedChanges: boolean;
    onConfirm: () => void;
    locale: string;
  }>;

  /**
   * Optional hook to get unsaved changes state
   */
  useUnsavedChanges?: () => {
    hasUnsavedChanges: boolean;
    clearAllUnsavedChanges: () => void;
  };

  /**
   * Show console logs for debugging
   */
  debug?: boolean;
}

/**
 * SessionMonitorWithModal component for monitoring session validity with UI feedback
 *
 * This component:
 * - Periodically checks the session validity
 * - Detects when token refresh fails
 * - Shows a modal when session expires
 * - Checks for unsaved changes and warns the user
 * - Handles automatic logout and redirect
 *
 * @example
 * import { SessionMonitorWithModal } from '@maany_shr/e-class-auth';
 * import { SessionExpirationModal } from '@maany_shr/e-class-ui-kit';
 * import { useUnsavedChanges } from '@maany_shr/e-class-ui-kit';
 *
 * <SessionProvider>
 *   <UnsavedChangesProvider>
 *     <SessionMonitorWithModal
 *       locale="en"
 *       SessionExpirationModal={SessionExpirationModal}
 *       useUnsavedChanges={useUnsavedChanges}
 *     />
 *     {children}
 *   </UnsavedChangesProvider>
 * </SessionProvider>
 */
export function SessionMonitorWithModal({
  checkInterval = 60000,
  loginPath = '/auth/login',
  locale,
  SessionExpirationModal,
  useUnsavedChanges,
  debug = false,
}: SessionMonitorWithModalProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [showExpirationModal, setShowExpirationModal] = useState(false);
  const [hasTriggeredCheck, setHasTriggeredCheck] = useState(false);

  // Get unsaved changes state if hook is provided
  const unsavedChangesState = useUnsavedChanges?.();
  const hasUnsavedChanges = unsavedChangesState?.hasUnsavedChanges ?? false;

  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[SessionMonitor]', ...args);
    }
  }, [debug]);

  const handleConfirmLogout = useCallback(async () => {
    log('User confirmed logout, clearing unsaved changes and signing out');

    // Clear unsaved changes
    if (unsavedChangesState?.clearAllUnsavedChanges) {
      unsavedChangesState.clearAllUnsavedChanges();
    }

    // Hide modal
    setShowExpirationModal(false);

    // Build callback URL with current path
    const callbackUrl = encodeURIComponent(pathname || '/');
    const redirectUrl = `${loginPath}?callbackUrl=${callbackUrl}&reason=session_expired`;

    log('Redirecting to:', redirectUrl);

    // Sign out and redirect
    await signOut({
      callbackUrl: redirectUrl,
      redirect: true
    });
  }, [unsavedChangesState, pathname, loginPath, log]);

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

        // Check if it's a refresh token error
        if (sessionError === 'RefreshAccessTokenError' || sessionError === 'RefreshTokenMissing') {
          log('Token refresh failed, showing expiration modal');
          setShowExpirationModal(true);
          setHasTriggeredCheck(true);
        }
      } else {
        log('Session valid');
        // Reset trigger if session becomes valid again
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
        // Trigger session update which will call the JWT callback
        // and check token expiration
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
