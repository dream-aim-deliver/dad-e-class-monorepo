import { z } from "zod";

export const LanguageSchema = z.object({
    name: z.string(),
    code: z.string()
});

export const PlatformLanguageSchema = LanguageSchema.extend({
    platformLanguageId: z.string().or(z.number()),
});

export type TLanguage = z.infer<typeof LanguageSchema>;
export type TPlatformLanguage = z.infer<typeof PlatformLanguageSchema>;
export type TPlatformLanguageId = TPlatformLanguage["platformLanguageId"];
