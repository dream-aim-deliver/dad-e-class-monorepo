'use client';

import { TGetPlatformSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
import React, { createContext, useContext } from 'react';

/**
 * Context for managing platform data fetched from the server.
 * This provides platform information (name, logo, etc.) to child components.
 */
interface PlatformContextValue {
    /** The platform data retrieved from the server */
    platform: TGetPlatformSuccessResponse['data'];
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

interface PlatformProviderProps {
    platform: TGetPlatformSuccessResponse['data'];
    children: React.ReactNode;
}

/**
 * Provider component for platform data context.
 * Should be used in layout files after fetching platform data from TRPC.
 *
 * @example
 * ```tsx
 * // In layout.tsx (server component)
 * import type { TGetPlatformUseCaseResponse } from '@dream-aim-deliver/e-class-cms-rest';
 *
 * const trpc = getServerTRPC({ platform_slug, platform_locale });
 * const queryClient = getQueryClient();
 * // @ts-expect-error - fetchQuery returns unknown, but we know the type from TRPC router
 * const platformResult: TGetPlatformUseCaseResponse = await queryClient.fetchQuery(
 *   trpc.getPlatform.queryOptions({})
 * );
 *
 * if (!platformResult.success) {
 *   throw new Error('Failed to load platform');
 * }
 *
 * return (
 *   <PlatformProvider platform={platformResult.data}>
 *     {children}
 *   </PlatformProvider>
 * );
 * ```
 */
export function PlatformProvider({ platform, children }: PlatformProviderProps) {
    return (
        <PlatformContext.Provider value={{ platform }}>
            {children}
        </PlatformContext.Provider>
    );
}

/**
 * Hook to access platform context.
 * Returns null if not within a platform route or if platform hasn't been loaded.
 *
 * @example
 * ```tsx
 * const platformContext = usePlatform();
 * if (platformContext) {
 *   console.log('Platform name:', platformContext.platform.name);
 *   console.log('Logo URL:', platformContext.platform.logoUrl);
 * }
 * ```
 */
export function usePlatform(): PlatformContextValue | null {
    return useContext(PlatformContext);
}

/**
 * Hook that throws if used outside a platform context.
 * Use this when the component MUST have access to platform data.
 *
 * @throws {Error} If used outside PlatformProvider
 */
export function useRequiredPlatform(): PlatformContextValue {
    const context = useContext(PlatformContext);
    if (!context) {
        throw new Error('useRequiredPlatform must be used within PlatformProvider');
    }
    return context;
}
