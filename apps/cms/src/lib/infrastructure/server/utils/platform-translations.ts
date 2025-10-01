import 'server-only';
import { TLocale, TNamespace, getDictionary } from '@maany_shr/e-class-translations';
import { getTranslations as getNextIntlTranslations } from 'next-intl/server';

/**
 * Server-side utility to get translations for a specific locale.
 * Useful when you need to access translations for the platform locale
 * in server components.
 *
 * @param locale - The locale to get translations for (platform locale)
 * @param namespace - Optional namespace for scoped translations (e.g., 'components.courseCard')
 * @returns Translation function for the specified locale
 *
 * @example
 * ```tsx
 * // In a server component within platform route
 * export default async function Page({ params }) {
 *   const resolvedParams = await params;
 *   const t = await getPlatformTranslations(resolvedParams.platform_locale as TLocale, 'components.courseCard');
 *   return <div>{t('title')}</div>;
 * }
 * ```
 */
export async function getPlatformTranslations(locale: TLocale, namespace?: TNamespace) {
    // For now, we'll use the standard next-intl getTranslations
    // In the future, this could be enhanced to use createTranslator
    // with the platform-specific locale if it differs from app locale

    // Get the dictionary for the platform locale
    const messages = getDictionary(locale);

    // Use next-intl's getTranslations with explicit locale
    // Note: This requires next-intl to support explicit locale parameter
    // If not supported, we might need to use createTranslator directly
    return await getNextIntlTranslations({ locale, messages, namespace } as any);
}

/**
 * Server-side utility to get the effective locale for content.
 * Uses platform locale if provided, otherwise falls back to app locale.
 *
 * @param platformLocale - Optional platform locale from route params
 * @param appLocale - The app locale from next-intl
 * @returns The effective locale to use for content
 *
 * @example
 * ```tsx
 * // In a server component
 * const locale = await getLocale(); // app locale
 * const contentLocale = getContentLocale(params.platform_locale as TLocale, locale as TLocale);
 * ```
 */
export function getContentLocale(platformLocale: TLocale | undefined, appLocale: TLocale): TLocale {
    return platformLocale || appLocale;
}

/**
 * Server-side helper to extract platform context from route parameters.
 *
 * @param params - Route parameters object
 * @returns Platform context if available, null otherwise
 *
 * @example
 * ```tsx
 * const platformContext = extractPlatformLocaleContext(params);
 * if (platformContext) {
 *   console.log('Platform:', platformContext.slug);
 *   console.log('Locale:', platformContext.locale);
 * }
 * ```
 */
export function extractPlatformLocaleContext(params: {
    platform_slug?: string;
    platform_locale?: string;
}): { slug: string; locale: TLocale } | null {
    if (params.platform_slug && params.platform_locale) {
        return {
            slug: params.platform_slug,
            locale: params.platform_locale as TLocale,
        };
    }
    return null;
}
