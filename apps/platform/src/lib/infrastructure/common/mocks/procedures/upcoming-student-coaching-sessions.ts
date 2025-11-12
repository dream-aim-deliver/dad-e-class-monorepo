import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// Mock data for upcoming coaching sessions (only scheduled sessions that are upcoming)
const listUpcomingStudentCoachingSessionsMock: useCaseModels.TListStudentCoachingSessionsSuccessResponse['data'] = {
    sessions: [
        // REQUESTED status - Sessions awaiting coach approval
        {
            id: 3,
            coachingOfferingTitle: 'Full Immersion',
            coachingOfferingDuration: 60,
            status: 'scheduled',
            startTime: '2025-09-26T10:00:00+00:00', // Future date for requested
            endTime: '2025-09-26T11:00:00+00:00',
            coach: {
                name: 'John',
                surname: 'Doe',
                username: 'john_doe',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 101,
                title: 'Python Programming Masterclass',
                slug: 'python-programming-masterclass'
            },
            meetingUrl: 'https://meet.example.com/session-3'
        },
        {
            id: 7,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'scheduled',
            startTime: '2025-09-27T14:00:00+00:00', // Future date for requested
            endTime: '2025-09-27T14:30:00+00:00',
            coach: {
                name: 'Alex',
                surname: 'Brown',
                username: 'alex_brown',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 105,
                title: 'Backend Development with Node.js',
                slug: 'backend-development-nodejs'
            },
            meetingUrl: 'https://meet.example.com/session-7'
        },

        // UPCOMING-EDITABLE status - Sessions more than 24 hours away
        {
            id: 8,
            coachingOfferingTitle: 'Quick Sprint',
            coachingOfferingDuration: 20,
            status: 'scheduled',
            startTime: '2025-09-28T10:00:00+00:00', // More than 24 hours away
            endTime: '2025-09-28T10:20:00+00:00',
            coach: {
                name: 'Emma',
                surname: 'Davis',
                username: 'emma_davis',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 106,
                title: 'Advanced React Development',
                slug: 'advanced-react-development'
            },
            meetingUrl: 'https://meet.example.com/session-8'
        },
    ]
};

export const listUpcomingStudentCoachingSessions = t.procedure
    .input(useCaseModels.ListStudentCoachingSessionsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListStudentCoachingSessionsUseCaseResponse> => {
            return {
                success: true,
                data: listUpcomingStudentCoachingSessionsMock,
            };
        },
    );