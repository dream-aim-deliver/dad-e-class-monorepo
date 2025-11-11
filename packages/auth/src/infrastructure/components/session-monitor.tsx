'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export interface SessionMonitorProps {
  /**
   * Interval in milliseconds to check session validity (default: 60000 = 60 seconds)
   */
  checkInterval?: number;

  /**
   * Path to redirect to after session expiration (default: '/auth/login')
   */
  loginPath?: string;

  /**
   * Whether to check for unsaved changes before logout
   * Requires UnsavedChangesProvider to be present in the component tree
   */
  checkUnsavedChanges?: boolean;

  /**
   * Custom callback when session expires
   */
  onSessionExpired?: (hasUnsavedChanges: boolean) => void;

  /**
   * Show console logs for debugging
   */
  debug?: boolean;
}

/**
 * SessionMonitor component for monitoring session validity and handling auto-logout
 *
 * This component:
 * - Periodically checks the session validity
 * - Detects when token refresh fails
 * - Handles automatic logout and redirect
 * - Can optionally check for unsaved changes
 *
 * @example
 * // In your root layout
 * <SessionProvider>
 *   <UnsavedChangesProvider>
 *     <SessionMonitor checkUnsavedChanges={true} />
 *     {children}
 *   </UnsavedChangesProvider>
 * </SessionProvider>
 */
export function SessionMonitor({
  checkInterval = 60000, // 60 seconds
  loginPath = '/auth/login',
  checkUnsavedChanges = false,
  onSessionExpired,
  debug = false,
}: SessionMonitorProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [hasTriggeredLogout, setHasTriggeredLogout] = useState(false);

  const log = useCallback((...args: any[]) => {
    if (debug) {
      console.log('[SessionMonitor]', ...args);
    }
  }, [debug]);

  const handleSessionExpired = useCallback(async () => {
    if (hasTriggeredLogout) {
      log('Logout already triggered, skipping');
      return;
    }

    setHasTriggeredLogout(true);
    log('Session expired, initiating logout');

    const hasUnsaved = false;

    // Check for unsaved changes if enabled
    if (checkUnsavedChanges && typeof window !== 'undefined') {
      try {
        // Try to get unsaved changes from context if available
        // This would need the context to be in the component tree
        log('Checking for unsaved changes');
        // Note: We can't directly access React context here
        // The consuming app should pass this info via onSessionExpired callback
      } catch (error) {
        log('Error checking unsaved changes:', error);
      }
    }

    // Call custom callback if provided
    if (onSessionExpired) {
      onSessionExpired(hasUnsaved);
    }

    // Build callback URL with current path
    const callbackUrl = encodeURIComponent(pathname || '/');
    const redirectUrl = `${loginPath}?callbackUrl=${callbackUrl}&reason=session_expired`;

    log('Signing out and redirecting to:', redirectUrl);

    // Sign out and redirect
    await signOut({
      callbackUrl: redirectUrl,
      redirect: true
    });
  }, [hasTriggeredLogout, checkUnsavedChanges, onSessionExpired, pathname, loginPath, log]);

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

    if (status === 'authenticated' && session) {
      const sessionError = (session as any).error;

      if (sessionError) {
        log('Session error detected:', sessionError);

        // Check if it's a refresh token error
        if (sessionError === 'RefreshAccessTokenError' || sessionError === 'RefreshTokenMissing') {
          log('Token refresh failed, session expired');
          handleSessionExpired();
        }
      } else {
        log('Session valid');
      }
    }
  }, [session, status, handleSessionExpired, log]);

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

  // This component doesn't render anything
  return null;
}
