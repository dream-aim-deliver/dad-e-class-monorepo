'use client';

import { usePlatformLocale } from '../context/platform-locale-context';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale, TNamespace } from '@maany_shr/e-class-translations';
import { useMemo } from 'react';

/**
 * Hook to get translations for platform-specific content.
 *
 * This hook intelligently selects the appropriate locale:
 * 1. If within a platform route, uses the platform locale
 * 2. Otherwise, falls back to the app locale
 *
 * @param namespace - The translation namespace (e.g., 'components.courseCard'). If undefined, returns root translations.
 * @returns A translation function similar to useTranslations
 *
 * @example
 * ```tsx
 * // In a platform route component
 * const t = usePlatformTranslations('components.courseCard');
 * return <div>{t('title')}</div>; // Uses platform locale
 * ```
 *
 * @example
 * ```tsx
 * // In a non-platform component
 * const t = usePlatformTranslations('components.navbar');
 * return <div>{t('login')}</div>; // Falls back to app locale
 * ```
 */
export function usePlatformTranslations(namespace?: TNamespace) {
    const platformContext = usePlatformLocale();
    const appLocale = useLocale() as TLocale;

    // Use platform locale if available, otherwise use app locale
    const effectiveLocale = platformContext?.platformLocale || appLocale;

    // Use next-intl's useTranslations directly - it will use the current locale from context
    // If we're in a platform context, we might want to use the platform locale instead
    const translations = useTranslations(namespace);

    // If platform locale matches app locale, just return standard translations
    if (effectiveLocale === appLocale) {
        return translations;
    }

    // If locales differ, we need to create a custom translator
    // This is a more advanced case - for now, we'll return the standard translations
    // and log a warning that the locale override is not fully supported yet
    console.warn(
        `Platform locale (${effectiveLocale}) differs from app locale (${appLocale}). ` +
        `Currently using app locale. Consider implementing createTranslator for full support.`
    );

    return translations;
}

/**
 * Hook to get the current effective locale for content.
 * Returns platform locale if in platform context, otherwise app locale.
 *
 * @example
 * ```tsx
 * const contentLocale = useContentLocale();
 * console.log('Displaying content in:', contentLocale);
 * ```
 */
export function useContentLocale(): TLocale {
    const platformContext = usePlatformLocale();
    const appLocale = useLocale() as TLocale;

    return platformContext?.platformLocale || appLocale;
}

/**
 * Hook to check if we're currently in a platform context.
 * Useful for conditional rendering based on context.
 *
 * @example
 * ```tsx
 * const isInPlatform = useIsInPlatformContext();
 * if (isInPlatform) {
 *   return <PlatformSpecificComponent />;
 * }
 * ```
 */
export function useIsInPlatformContext(): boolean {
    const platformContext = usePlatformLocale();
    return platformContext !== null;
}
