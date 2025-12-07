import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

export const requestCoachingSession = t.procedure
    .input(useCaseModels.RequestCoachingSessionRequestSchema)
    .mutation<useCaseModels.TRequestCoachingSessionUseCaseResponse>((opts) => {
        const { sessionId, coachUsername, startTime, briefing, lessonComponentId } = opts.input;

        // Mock logic: Create a new coaching session request
        // In a real app, this would call the backend
        console.log(`Requesting coaching session:`, {
            sessionId,
            coachUsername,
            startTime,
            briefing,
            lessonComponentId,
        });

        return {
            success: true,
            data: {},
        };
    });
