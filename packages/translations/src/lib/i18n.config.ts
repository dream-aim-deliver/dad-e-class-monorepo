import { z } from "zod";
import { TDictionary } from "./dictionaries/base";
import { DE } from "./dictionaries/de";
import { EN } from "./dictionaries/en";

// Add your locales to the enum below
export const localesSchema = z.enum(['en', 'de']);
export type TLocale = z.infer<typeof localesSchema>;
export const locales = Object.values(localesSchema.Values).map((locale) => locale);

// Add your dictionaries to the object below
export const dictionaries: Record<TLocale, TDictionary> = {
  en: EN,
  de: DE,
};


export const i18nConfig = {
  defaultLocale: localesSchema.Values.en,
  locales: locales,
} as const;
