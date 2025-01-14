import { z } from "zod";

export const LanguageEnum = z.enum(["English", "German"]);

export type TLanguage = z.infer<typeof LanguageEnum>;
