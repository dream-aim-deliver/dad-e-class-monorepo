import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

export const scheduleCoachingSession = t.procedure
    .input(useCaseModels.ScheduleCoachingSessionRequestSchema)
    .mutation<useCaseModels.TScheduleCoachingSessionUseCaseResponse>((opts) => {
        const { coachingSessionId } = opts.input;

        // Mock logic: Find the session and update its status to 'scheduled'
        // In a real app, this would call the backend
        const mockScheduledSession: useCaseModels.TScheduleCoachingSessionSuccessResponse['data']['coachingSession'] = {
            id: coachingSessionId,
            coachingOfferingTitle: 'Scheduled Coaching Session',
            coachingOfferingDuration: 30,
            status: 'scheduled',
            startTime: '2025-09-25T10:00:00+00:00', // Mock start time
            endTime: '2025-09-25T10:30:00+00:00',   // Mock end time
            student: {
                name: 'Mock',
                surname: 'Student',
                username: 'mock.student',
                avatarUrl: null,
            },
            course: {
                id: 204,
                title: 'Mock Course',
                slug: 'mock-course',
            },
            meetingUrl: 'https://meet.example.com/session/' + coachingSessionId,
        };

        return {
            success: true,
            data: {
                coachingSession: mockScheduledSession,
            },
        };
    });