import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const availableCoachings: useCaseModels.TListAvailableCoachingsSuccessResponse['data'] =
    {
        offerings: [
            {
                id: 1,
                name: 'Quick feedback',
                duration: 10,
                boughtCoachingIds: [1, 2],
            },
            {
                id: 2,
                name: 'Quick sprint',
                duration: 20,
                boughtCoachingIds: [3, 4, 5],
            },
            {
                id: 4,
                name: 'Full immersion',
                duration: 60,
                boughtCoachingIds: [6],
            },
            {
                id: 5,
                name: '1/2 day workshop',
                duration: 240,
                boughtCoachingIds: [7],
            },
        ],
    };

export const listAvailableCoachings = t.procedure
    .input(useCaseModels.ListAvailableCoachingsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListAvailableCoachingsUseCaseResponse> => {
            return {
                success: true,
                data: availableCoachings,
            };
        },
    );
