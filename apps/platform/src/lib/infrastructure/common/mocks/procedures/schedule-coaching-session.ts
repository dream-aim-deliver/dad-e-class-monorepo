import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

export const scheduleCoachingSession = t.procedure
    .input(useCaseModels.ScheduleCoachingSessionRequestSchema)
    .mutation<useCaseModels.TScheduleCoachingSessionUseCaseResponse>((opts) => {
        const { coachingSessionId } = opts.input;

        // Mock logic: Find the session and update its status to 'scheduled'
        // In a real app, this would call the backend
        console.log(`Scheduling coaching session ${coachingSessionId}`);

        return {
            success: true,
            data: {},
        };
    });