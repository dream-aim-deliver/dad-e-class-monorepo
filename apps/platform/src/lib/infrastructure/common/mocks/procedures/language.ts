import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listLanguagesMock: useCaseModels.TGetLanguagesSuccessResponse = {
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

const listLanguagesErrorMock: useCaseModels.TGetLanguagesUseCaseErrorResponse =
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
    .input(useCaseModels.GetLanguagesRequestSchema)
    .query(
        async (opts): Promise<useCaseModels.TGetLanguagesUseCaseResponse> => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return listLanguagesMock;
        },
    );
