import { language } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { z } from 'zod';

const listLanguagesMock: language.TLanguage[] = [
    {
        code: 'en',
        name: 'English',
    },
    {
        code: 'de',
        name: 'Deutsch',
    },
];

const ListLanguageInputSchema = z.object({
    platformId: z.string().or(z.number()),
});

export const listLanguages = t.procedure
    .input(ListLanguageInputSchema)
    .query(async (opts): Promise<language.TLanguage[]> => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return listLanguagesMock;
    });
