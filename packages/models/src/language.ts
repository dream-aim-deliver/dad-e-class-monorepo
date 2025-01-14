import { z } from "zod";


export const LanguageSchema = z.union([
    z.object({ name: z.literal("English"), code: z.literal("ENG") }),
    z.object({ name: z.literal("German"), code: z.literal("DEU") })
]);

export type TLanguage = z.infer<typeof LanguageSchema>;

