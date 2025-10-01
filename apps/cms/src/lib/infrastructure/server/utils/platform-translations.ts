import 'server-only';
import { TLocale, TNamespace, getDictionary, getScopedMessages, type TDictionary, type ScopedMessages } from '@maany_shr/e-class-translations';

/**
 * Server-side utility to get translations for a specific locale.
 * Useful when you need to access translations for the platform locale
 * in server components.
 *
 * This implementation uses type-safe message extraction, avoiding the need
 * for unsafe type casting.
 *
 * @param locale - The locale to get translations for (platform locale)
 * @param namespace - Optional namespace for scoped translations (e.g., 'components.courseCard')
 * @returns Scoped messages object with full type safety
 *
 * @example
 * ```tsx
 * // In a server component within platform route
 * export default async function Page({ params }) {
 *   const resolvedParams = await params;
 *   const messages = getPlatformTranslations(resolvedParams.platform_locale as TLocale, 'components.courseCard');
 *   // messages is fully typed! Access messages.createdBy, messages.you, etc.
 *   return <div>{messages.createdBy}</div>;
 * }
 * ```
 */
export function getPlatformTranslations<N extends TNamespace>(
    locale: TLocale,
    namespace?: N
): ScopedMessages<TDictionary, N> {
    // Get the full dictionary for the specified locale
    const dictionary = getDictionary(locale);

    // Extract scoped messages for the namespace (or full dictionary if no namespace)
    // This is type-safe and returns the correctly typed messages object
    const messages = namespace
        ? getScopedMessages<TDictionary, N>(dictionary, namespace)
        : dictionary;

    // Return properly typed messages
    // No need for 'as any' - everything is type-safe!
    return messages as ScopedMessages<TDictionary, N>;
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
