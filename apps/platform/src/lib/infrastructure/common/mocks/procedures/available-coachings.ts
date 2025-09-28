import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const availableCoachings: useCaseModels.TListAvailableCoachingsUseCaseResponse['data'] = {
    offerings: [
        // Quick feedback - had boughtCoachingIds: [1, 2] - duplicate twice
        {
            id: 1,
            name: 'Quick feedback',
            duration: 10,
        },
        {
            id: 1,
            name: 'Quick feedback',
            duration: 10,
        },
        // Quick sprint - had boughtCoachingIds: [3, 4, 5] - duplicate three times
        {
            id: 2,
            name: 'Quick sprint',
            duration: 20,
        },
        {
            id: 2,
            name: 'Quick sprint',
            duration: 20,
        },
        {
            id: 2,
            name: 'Quick sprint',
            duration: 20,
        },
        // Full immersion - had boughtCoachingIds: [6] - single entry
        {
            id: 4,
            name: 'Full immersion',
            duration: 60,
        },
        // 1/2 day workshop - had boughtCoachingIds: [7] - single entry
        {
            id: 5,
            name: '1/2 day workshop',
            duration: 240,
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
