'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import type { RuntimeConfig } from '../../types/runtime-config';

const RuntimeConfigContext = createContext<RuntimeConfig | null>(null);

export interface RuntimeConfigProviderProps {
    children: ReactNode;
    config: RuntimeConfig;
}

/**
 * Runtime Config Provider
 *
 * Provides runtime configuration to client components.
 * The config is obtained from the server using Next.js 15's dynamic rendering.
 *
 * Usage:
 * ```tsx
 * // In a server component:
 * import { connection } from 'next/server';
 * import env from '@/lib/infrastructure/server/config/env';
 *
 * await connection(); // Enable dynamic rendering
 * const config = {
 *   NEXT_PUBLIC_E_CLASS_RUNTIME: env.NEXT_PUBLIC_E_CLASS_RUNTIME,
 *   NEXT_PUBLIC_E_CLASS_PLATFORM_NAME: env.NEXT_PUBLIC_E_CLASS_PLATFORM_NAME,
 *   NEXT_PUBLIC_APP_URL: env.NEXT_PUBLIC_APP_URL,
 *   NEXT_PUBLIC_E_CLASS_CMS_REST_URL: env.NEXT_PUBLIC_E_CLASS_CMS_REST_URL,
 * };
 *
 * return (
 *   <RuntimeConfigProvider config={config}>
 *     <YourApp />
 *   </RuntimeConfigProvider>
 * );
 * ```
 */
export function RuntimeConfigProvider({
    children,
    config,
}: RuntimeConfigProviderProps) {
    // Memoize config to prevent re-renders when reference changes but values are same
    // Config is static but object reference may change on server re-renders
    const value = useMemo(() => config, [config]);

    return (
        <RuntimeConfigContext.Provider value={value}>
            {children}
        </RuntimeConfigContext.Provider>
    );
}

/**
 * Hook to access runtime configuration in client components
 *
 * @throws Error if used outside of RuntimeConfigProvider
 *
 * Usage:
 * ```tsx
 * const config = useRuntimeConfig();
 * console.log(config.NEXT_PUBLIC_APP_URL);
 * ```
 */
export function useRuntimeConfig(): RuntimeConfig {
    const context = useContext(RuntimeConfigContext);
    if (!context) {
        throw new Error(
            'useRuntimeConfig must be used within RuntimeConfigProvider. ' +
                'Make sure your component is wrapped in a RuntimeConfigProvider.'
        );
    }
    return context;
}
