// TODO: should align with the database representation (2-letter VS 3-letter)
import { language } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

export const languageCodeToLocale: Record<string, TLocale> = {
    en: 'en',
    de: 'de',
};

export const localeToLanguageCode: Record<TLocale, string> = Object.entries(
    languageCodeToLocale,
).reduce(
    (acc, [languageCode, locale]) => {
        acc[locale] = languageCode;
        return acc;
    },
    {} as Record<TLocale, string>,
);

// Server-side global cache
const cachedPlatformLanguageIds: Record<string, language.TPlatformLanguageId> =
    {};

export function storePlatformLanguageId(
    locale: string,
    id: language.TPlatformLanguageId,
): void {
    cachedPlatformLanguageIds[locale] = id;
}

export function getPlatformLanguageId(
    locale: string,
): language.TPlatformLanguageId | undefined {
    return cachedPlatformLanguageIds[locale];
}
