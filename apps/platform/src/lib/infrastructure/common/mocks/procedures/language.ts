import { language } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { z } from 'zod';

const listLanguagesMock: language.TPlatformLanguage[] = [
    {
        code: 'en',
        name: 'English',
        platformLanguageId: 1,
    },
    {
        code: 'de',
        name: 'Deutsch',
        platformLanguageId: 2,
    },
];

const ListLanguageInputSchema = z.object({
    platformId: z.string().or(z.number()),
});

export const listLanguages = t.procedure
    .input(ListLanguageInputSchema)
    .query(async (opts): Promise<language.TPlatformLanguage[]> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return listLanguagesMock;
    });
