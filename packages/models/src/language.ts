import { z } from "zod";


export const LanguageSchema = z.object({
    name: z.string(),
    code: z.string()
});

export type TLanguage = z.infer<typeof LanguageSchema>;
