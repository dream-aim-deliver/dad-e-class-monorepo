'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import React, { createContext, useContext, useMemo } from 'react';

/**
 * Context for managing platform-specific locale information.
 * This is separate from the app-level locale managed by next-intl.
 *
 * Use cases:
 * - App locale (via next-intl): UI language (navigation, buttons, labels)
 * - Platform locale (via this context): Content language (course data, platform content)
 */
interface PlatformLocaleContextValue {
    /** The slug/identifier of the current platform */
    platformSlug: string;
    /** The locale for platform content (may differ from app UI locale) */
    platformLocale: TLocale;
}

const PlatformLocaleContext = createContext<PlatformLocaleContextValue | null>(null);

interface PlatformLocaleProviderProps {
    platformSlug: string;
    platformLocale: TLocale;
    children: React.ReactNode;
}

/**
 * Provider component for platform locale context.
 * Should be used in layout files for platform-specific routes.
 *
 * @example
 * ```tsx
 * // In [platform_locale]/layout.tsx
 * <PlatformLocaleProvider platformSlug={params.platform_slug} platformLocale={params.platform_locale as TLocale}>
 *   {children}
 * </PlatformLocaleProvider>
 * ```
 */
export function PlatformLocaleProvider({ platformSlug, platformLocale, children }: PlatformLocaleProviderProps) {
    // Memoize context value to prevent unnecessary re-renders
    const value = useMemo(() => ({ platformSlug, platformLocale }), [platformSlug, platformLocale]);

    return (
        <PlatformLocaleContext.Provider value={value}>
            {children}
        </PlatformLocaleContext.Provider>
    );
}

/**
 * Hook to access platform locale context.
 * Returns null if not within a platform route.
 *
 * @example
 * ```tsx
 * const platformContext = usePlatformLocale();
 * if (platformContext) {
 *   console.log('Platform:', platformContext.platformSlug);
 *   console.log('Content locale:', platformContext.platformLocale);
 * }
 * ```
 */
export function usePlatformLocale(): PlatformLocaleContextValue | null {
    return useContext(PlatformLocaleContext);
}

/**
 * Hook that throws if used outside a platform context.
 * Use this when the component MUST be within a platform route.
 *
 * @throws {Error} If used outside PlatformLocaleProvider
 */
export function useRequiredPlatformLocale(): PlatformLocaleContextValue {
    const context = useContext(PlatformLocaleContext);
    if (!context) {
        throw new Error('useRequiredPlatformLocale must be used within PlatformLocaleProvider');
    }
    return context;
}
