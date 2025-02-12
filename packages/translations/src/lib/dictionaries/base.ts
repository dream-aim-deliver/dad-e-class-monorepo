import { z } from 'zod';

export const DictionarySchema = z.object({
    home: z.object({
        title: z.string(),
        buttonText: z.string(),
    }),
    components: z.object({
        skills: z.object({
            title: z.string(),
        }),
    }),
});
export type TDictionary = z.infer<typeof DictionarySchema>;