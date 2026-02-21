import { TLocale } from "../i18n.config";

/**
 * Interface for the props of components in the ui-kit or pages in the platform that are locale-aware.
 */


export interface isLocalAware {
    locale: TLocale
}

/**
 * Resolves a localized value based on the current locale.
 * Falls back to the other language if the locale-matched value is empty/null.
 */
export function getLocalizedValue(
    enValue: string | null | undefined,
    deValue: string | null | undefined,
    locale: TLocale,
): string {
    if (locale === 'de') return deValue || enValue || '';
    return enValue || deValue || '';
}