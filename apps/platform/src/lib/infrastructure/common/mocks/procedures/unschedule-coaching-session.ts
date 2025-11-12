import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { updateSessionStatus, getSessionById } from './student-coaching-sessions';

export const unscheduleCoachingSession = t.procedure
    .input(useCaseModels.UnscheduleCoachingSessionRequestSchema)
    .mutation<useCaseModels.TUnscheduleCoachingSessionUseCaseResponse>((opts) => {
        const { coachingSessionId } = opts.input;

        // TODO: Replace with real backend API call
        // Since the backend is now fully implemented, this mock should be replaced
        
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
            startTime: originalSession?.startTime || new Date().toISOString(),
            endTime: originalSession?.endTime || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            state: 'created' as const,
            createdAt: originalSession?.createdAt || new Date(),
            updatedAt: originalSession?.updatedAt || new Date(),
            publicationDate: originalSession?.publicationDate || new Date().toISOString(),
            meetingUrl: originalSession?.meetingUrl || null,
            couponName: originalSession?.couponName || null,
        };

        return {
            success: true,
            data: {
                coachingSession: mockUnscheduledSession,
            },
        };
    });
