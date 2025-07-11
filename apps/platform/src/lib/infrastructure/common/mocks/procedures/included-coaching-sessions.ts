import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listIncludedCoachingSessionsMock: useCaseModels.TListIncludedCoachingSessionsSuccessResponse['data'] =
    {
        offers: [
            {
                name: 'Quick sprint',
                duration: 20,
                availableIds: ['session_001', 'session_002', 'session_003'],
                usedCount: 2,
            },
            {
                name: 'Normal Sprint',
                duration: 30,
                availableIds: ['session_004', 'session_005'],
                usedCount: 1,
            },
            {
                name: 'Full Immersion',
                duration: 60,
                availableIds: ['session_006'],
                usedCount: 0,
            },
        ],
    };

export const listIncludedCoachingSessions = t.procedure
    .input(useCaseModels.ListIncludedCoachingSessionsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListIncludedCoachingSessionsUseCaseResponse> => {
            return {
                success: true,
                data: listIncludedCoachingSessionsMock,
            };
        },
    );
