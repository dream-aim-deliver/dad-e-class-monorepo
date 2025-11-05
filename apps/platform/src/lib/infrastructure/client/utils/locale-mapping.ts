import { TLocale } from '@maany_shr/e-class-translations';

/**
 * Maps locale codes to their corresponding locale-country codes for date/time formatting
 * @example
 * getLocaleCountryCode('de') // returns 'de-DE'
 * getLocaleCountryCode('en') // returns 'en-GB'
 */
export function getLocaleCountryCode(locale: TLocale): string {
  const localeMap: Record<TLocale, string> = {
    de: 'de-DE',
    en: 'en-GB',
  };

  return localeMap[locale] || 'en-GB'; // Default to en-GB if locale not found
}
