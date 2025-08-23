import { TDictionary } from './dictionaries/base';
import { dictionaries, TLocale } from './i18n.config';
/**
 * Fetches a specific namespace from the translation files.
 *
 * @param locale The locale to fetch dictionary for (e.g., 'en', 'de').
 * @returns The dictionary for the specified locale.
 * @throws If the locale is not found in the dictionaries.
 */
export const getDictionary =  (
  locale: TLocale,
): TDictionary => {

  const dictionary = dictionaries[locale];
  if (!dictionary) {
    throw new Error(`Dictionary not found for locale: ${locale}`);
  }
  return dictionary;
};