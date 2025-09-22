import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';


export const unscheduleCoachingSession = t.procedure
    .input(useCaseModels.UnscheduleCoachingSessionRequestSchema)
    .mutation<useCaseModels.TUnscheduleCoachingSessionUseCaseResponse>((opts) => {
        const { coachingSessionId } = opts.input;

        // Mock logic: Find the session and update its status to 'unscheduled'
        // In a real app, this would call the backend
        const mockUnscheduledSession: useCaseModels.TUnscheduleCoachingSessionSuccessResponse['data']['coachingSession'] = {
            id: coachingSessionId,
            coachingOfferingTitle: 'Unscheduled Coaching Session',
            coachingOfferingDuration: 30,
            status: 'unscheduled',
        };

        return {
            success: true,
            data: {
                coachingSession: mockUnscheduledSession,
            },
        };
    });
