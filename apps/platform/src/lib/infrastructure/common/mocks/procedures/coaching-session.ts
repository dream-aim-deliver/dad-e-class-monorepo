import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const scheduleCoachingSessionMock: useCaseModels.TScheduleCoachingSessionSuccessResponse['data'] =
    {};

export const scheduleCoachingSession = t.procedure
    .input(useCaseModels.ScheduleCoachingSessionRequestSchema)
    .query(
        async (): Promise<useCaseModels.TScheduleCoachingSessionUseCaseResponse> => {
            return {
                success: true,
                data: scheduleCoachingSessionMock,
            };
        },
    );
