import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { updateSessionStatus, getSessionById } from './student-coaching-sessions';

export const unscheduleCoachingSession = t.procedure
    .input(useCaseModels.UnscheduleCoachingSessionRequestSchema)
    .mutation<useCaseModels.TUnscheduleCoachingSessionUseCaseResponse>((opts) => {
        const { coachingSessionId } = opts.input;

        // Get the original session data
        const originalSession = getSessionById(coachingSessionId);

        // In a mock environment, we'll assume the session always exists
        // Update the session status to unscheduled
        updateSessionStatus(coachingSessionId, 'unscheduled');

        // Use the original session data if available, or fallback to defaults
        const mockUnscheduledSession: useCaseModels.TUnscheduleCoachingSessionSuccessResponse['data']['coachingSession'] = {
            id: coachingSessionId,
            coachingOfferingTitle: originalSession?.coachingOfferingTitle || 'Unscheduled Coaching Session',
            coachingOfferingDuration: originalSession?.coachingOfferingDuration || 30,
            status: 'unscheduled',
        };

        return {
            success: true,
            data: {
                coachingSession: mockUnscheduledSession,
            },
        };
    });
