import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const coachCoachingSessionsMock: useCaseModels.TListCoachCoachingSessionsSuccessResponse['data'] = {
    sessions: [
        // upcoming scheduled session
        {
            id: 101,
            coachingOfferingTitle: 'One-on-one React Review',
            coachingOfferingDuration: 30,
            status: 'scheduled',
            startTime: '2025-09-20T10:00:00+00:00',
            endTime: '2025-09-20T10:30:00+00:00',
            student: {
                name: 'Alice',
                surname: 'Johnson',
                username: 'alice.j',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?auto=format&fit=crop&w=256&q=80',
            },
            course: {
                id: 201,
                title: 'Advanced React Development',
                slug: 'advanced-react-dev',
            },
            meetingUrl: 'https://meet.example.com/session/101',
        },

        // requested session (no meeting url yet)
        {
            id: 102,
            coachingOfferingTitle: 'TypeScript Q&A',
            coachingOfferingDuration: 45,
            status: 'requested',
            startTime: '2025-09-22T14:00:00+00:00',
            endTime: '2025-09-22T14:45:00+00:00',
            student: {
                name: 'Bob',
                surname: 'Smith',
                username: 'bob.smith',
                avatarUrl: null,
            },
            course: {
                id: 202,
                title: 'TypeScript Fundamentals',
                slug: 'typescript-fundamentals',
            },
            meetingUrl: null,
        },

        // ended (completed) session with review
        {
            id: 103,
            coachingOfferingTitle: 'Portfolio Review',
            coachingOfferingDuration: 60,
            status: 'completed',
            startTime: '2025-08-10T09:00:00+00:00',
            endTime: '2025-08-10T10:00:00+00:00',
            student: {
                name: 'Carol',
                surname: 'Davis',
                username: 'carol.d',
                avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
            },
            course: null,
            review: {
                rating: 5,
                comment: 'Very helpful, covered key improvements',
            },
        },

        // unscheduled session (no times)
        {
            id: 104,
            coachingOfferingTitle: 'General Coaching Slot',
            coachingOfferingDuration: 30,
            status: 'requested',
            // upcoming/unscheduled sessions don't need start/end
            startTime: '2025-10-01T00:00:00+00:00',
            endTime: '2025-10-01T00:30:00+00:00',
            student: {
                name: null,
                surname: null,
                username: 'guest.user',
                avatarUrl: null,
            },
            course: {
                id: 203,
                title: 'Python for Beginners',
                slug: 'python-beginners',
            },
            meetingUrl: null,
        },

        // canceled session
        {
            id: 105,
            coachingOfferingTitle: 'Canceled Session Example',
            coachingOfferingDuration: 20,
            status: 'scheduled',
            startTime: '2025-07-01T12:00:00+00:00',
            endTime: '2025-07-01T12:20:00+00:00',
            student: {
                name: 'Eva',
                surname: 'Martinez',
                username: 'eva.m',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&q=80',
            },
            course: null,
            meetingUrl: null,
        },
    ],
};

export const listCoachCoachingSessions = t.procedure
    .input(useCaseModels.ListCoachCoachingSessionsRequestSchema)
    .query<useCaseModels.TListCoachCoachingSessionsUseCaseResponse>(() => {
        return {
            success: true,
            data: coachCoachingSessionsMock,
        };
    });