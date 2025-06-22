import { useCaseModels, viewModels, entities } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const platformMock: useCaseModels.TGetPlatformSuccessResponse['data'] = {
    id: 1,
    name: 'Just Do Ad',
    logoUrl:
        'https://res.cloudinary.com/dnhiejjyu/image/upload/v1748270861/a_wy7cuh_kwevw6.png',
    backgroundImageUrl:
        'https://res.cloudinary.com/dsyephqpf/image/upload/v1747650265/background-eln_mhvipu.jpg',
    footerContent: entities.RichText.parse(
        JSON.stringify([
            {
                type: 'paragraph',
                children: [
                    {
                        text: '© 2024 JUST DO AD GmbH • Hermetschloostrasse 70, 8048 Zürich • hi@justdoad.ai',
                    },
                ],
            },
        ]),
    ),
};

const platformSuccess: useCaseModels.TGetPlatformSuccessResponse = {
    success: true,
    data: platformMock,
};

const platformCriticalError: useCaseModels.TGetPlatformUseCaseErrorResponse = {
    success: false,
    data: {
        message: 'Unknown critical error occurred',
        errorType: 'UnknownError',
        operation: 'getPlatform',
        context: {},
    },
};

export const getPlatform = t.procedure
    .input(useCaseModels.GetPlatformRequestSchema)
    .query(async (opts): Promise<useCaseModels.TGetPlatformUseCaseResponse> => {
        return platformSuccess;
    });
