import type { Locale } from './i18n.config';

// Define the structure of your translation files
interface Dictionary {
  home: {
    title: string,
    buttonLabel: string
  }
}

// Define the structure of your dictionaries
const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module as Dictionary),
  de: () => import('./dictionaries/de.json').then((module) => module as Dictionary),
};

/**
 * Fetches a specific namespace from the translation files.
 *
 * @param locale The locale to fetch translations for (e.g., 'en', 'de').
 * @param namespace The namespace of the translations (e.g., 'common', 'buttons', 'forms').
 * @returns The translations for the specified namespace.
 */

export const getDictionary = async <T extends keyof Dictionary>(
  locale: Locale,
  namespace: T
): Promise<Dictionary[T]> => {
  try {
    const response = await fetch(`/locales/${locale}.json`);
    const dictionary = await response.json();
    if (namespace in dictionary) {
      return dictionary[namespace];
    } else {
      throw new Error(`Namespace "${namespace}" not found in dictionary for locale "${locale}".`);
    }
  } catch (error) {
    console.error(`Failed to load dictionary for locale "${locale}" and namespace "${namespace}":`, error);
    return {} as Dictionary[T]; // Fallback to an empty object
  }
};