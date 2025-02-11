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

  if(!dictionaries[locale]) {
    throw new Error(`Locale ${locale} not found in dictionaries. Please use one of the following locales: ${Object.keys(dictionaries).join(', ')}`);  
  }
  return dictionaries[locale];
    
};