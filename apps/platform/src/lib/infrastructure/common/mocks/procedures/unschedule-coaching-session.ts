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
            startTime: (originalSession as any)?.startTime || new Date().toISOString(),
            endTime: (originalSession as any)?.endTime || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
            state: 'created' as const,
            createdAt: (originalSession as any)?.createdAt || new Date(),
            updatedAt: (originalSession as any)?.updatedAt || new Date(),
            publicationDate: (originalSession as any)?.publicationDate || new Date().toISOString(),
            meetingUrl: (originalSession as any)?.meetingUrl || null,
            couponName: (originalSession as any)?.couponName || null,
        };

        return {
            success: true,
            data: {
                coachingSession: mockUnscheduledSession,
            },
        };
    });
