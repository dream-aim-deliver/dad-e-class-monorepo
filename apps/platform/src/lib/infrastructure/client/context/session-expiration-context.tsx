'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';

interface SessionExpirationContextType {
    /**
     * Trigger the session expiration modal.
     * Called when tRPC returns UNAUTHORIZED error indicating token is invalid at server level.
     */
    triggerExpiration: () => void;
}

const SessionExpirationContext = createContext<SessionExpirationContextType | null>(null);

export interface SessionExpirationProviderProps {
    children: ReactNode;
    onExpiration: () => void;
}

/**
 * Session Expiration Provider
 *
 * Provides a callback to trigger session expiration modal from anywhere in the component tree.
 * Used by tRPC client to notify SessionMonitor when UNAUTHORIZED errors occur.
 *
 * This bridges the gap between:
 * - NextAuth's local token cache (thinks token is valid)
 * - tRPC server's actual token validation (knows token is expired)
 */
export function SessionExpirationProvider({
    children,
    onExpiration,
}: SessionExpirationProviderProps) {
    const triggerExpiration = useCallback(() => {
        onExpiration();
    }, [onExpiration]);

    const value = useMemo(
        () => ({ triggerExpiration }),
        [triggerExpiration]
    );

    return (
        <SessionExpirationContext.Provider value={value}>
            {children}
        </SessionExpirationContext.Provider>
    );
}

/**
 * Hook to trigger session expiration from client components.
 *
 * Returns a no-op function if used outside of SessionExpirationProvider,
 * allowing safe usage in components that may not always be wrapped.
 *
 * Usage:
 * ```tsx
 * const { triggerExpiration } = useSessionExpiration();
 * // On UNAUTHORIZED error:
 * triggerExpiration();
 * ```
 */
export function useSessionExpiration(): SessionExpirationContextType {
    const context = useContext(SessionExpirationContext);

    // Return no-op if context is not available
    // This allows the hook to be used safely outside the provider
    if (!context) {
        return {
            triggerExpiration: () => {
                console.warn(
                    '[SessionExpiration] triggerExpiration called outside of SessionExpirationProvider'
                );
            },
        };
    }

    return context;
}
