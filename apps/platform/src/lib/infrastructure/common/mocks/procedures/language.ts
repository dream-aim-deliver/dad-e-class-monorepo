import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listLanguagesMock: useCaseModels.TListLanguagesSuccessResponse = {
    success: true,
    data: {
        languages: [
            {
                languageCode: 'en',
                language: 'English',
            },
            {
                languageCode: 'de',
                language: 'Deutsch',
            },
        ],
    },
};

const listLanguagesErrorMock: useCaseModels.TListLanguagesUseCaseErrorResponse =
    {
        success: false,
        data: {
            errorType: 'UnknownError',
            message: 'An unknown error occurred while fetching languages.',
            operation: 'listLanguages',
            context: {},
        },
    };

export const listLanguages = t.procedure
    .input(useCaseModels.ListLanguagesRequestSchema)
    .query(
        async (opts): Promise<useCaseModels.TGetLanguagesUseCaseResponse> => {
            return listLanguagesMock;
        },
    );
