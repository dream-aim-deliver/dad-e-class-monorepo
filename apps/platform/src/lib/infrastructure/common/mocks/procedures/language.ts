import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listLanguagesMock: useCaseModels.TListLanguagesUseCaseResponse = {
    success: true,
    data: {
        languages: [
            {
                code: 'en',
                name: 'English',
                state: 'created' as const,
                id: 1,
                createdAt: new Date('2020-01-01T00:00:00.000Z'),
                updatedAt: new Date('2020-01-01T00:00:00.000Z'),
            },
            {
                code: 'de',
                name: 'Deutsch',
                state: 'created' as const,
                id: 2,
                createdAt: new Date('2020-01-01T00:00:00.000Z'),
                updatedAt: new Date('2020-01-01T00:00:00.000Z'),
            },
        ],
    },
};

export const listLanguages = t.procedure
    .input(useCaseModels.ListLanguagesRequestSchema)
    .query(
        async (opts): Promise<useCaseModels.TListLanguagesUseCaseResponse> => {
            return listLanguagesMock;
        },
    );
