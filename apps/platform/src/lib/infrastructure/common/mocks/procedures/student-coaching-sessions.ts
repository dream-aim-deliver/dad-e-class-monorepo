import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const listStudentCoachingSessionsMock: useCaseModels.TListStudentCoachingSessionsSuccessResponse['data'] = {
    sessions: [
        {
            id: 1,
            coachingOfferingTitle: 'JavaScript Fundamentals Session',
            coachingOfferingDuration: 30,
            status: 'unscheduled'
        },
        {
            id: 2,
            coachingOfferingTitle: 'React Advanced Concepts',
            coachingOfferingDuration: 45,
            status: 'unscheduled'
        },
        {
            id: 3,
            coachingOfferingTitle: 'Python Data Structures',
            coachingOfferingDuration: 60,
            status: 'requested',
            startTime: '2025-01-20T14:00:00+00:00',
            endTime: '2025-01-20T15:00:00+00:00',
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
            id: 4,
            coachingOfferingTitle: 'Web Development Best Practices',
            coachingOfferingDuration: 45,
            status: 'scheduled',
            startTime: '2025-01-22T16:00:00+00:00',
            endTime: '2025-01-22T16:45:00+00:00',
            coach: {
                name: 'Jane',
                surname: 'Smith',
                username: 'jane_smith',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 102,
                title: 'Full Stack Web Development',
                slug: 'full-stack-web-development'
            },
            meetingUrl: 'https://meet.example.com/session-4'
        },
        {
            id: 5,
            coachingOfferingTitle: 'Algorithm Design Session',
            coachingOfferingDuration: 60,
            status: 'completed',
            startTime: '2025-01-15T10:00:00+00:00',
            endTime: '2025-01-15T11:00:00+00:00',
            coach: {
                name: 'Mike',
                surname: 'Johnson',
                username: 'mike_johnson',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 103,
                title: 'Data Structures and Algorithms',
                slug: 'data-structures-algorithms'
            },
            review: {
                rating: 5,
                comment: 'Excellent session! Very helpful and clear explanations.'
            }
        },
        {
            id: 6,
            coachingOfferingTitle: 'Database Design Workshop',
            coachingOfferingDuration: 90,
            status: 'completed',
            startTime: '2025-01-10T13:00:00+00:00',
            endTime: '2025-01-10T14:30:00+00:00',
            coach: {
                name: 'Sarah',
                surname: 'Wilson',
                username: 'sarah_wilson',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 104,
                title: 'Database Systems',
                slug: 'database-systems'
            },
            review: {
                rating: 4,
                comment: 'Good session, covered all the important concepts.'
            }
        }
    ]
};

export const listStudentCoachingSessions = t.procedure
    .input(useCaseModels.ListStudentCoachingSessionsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListStudentCoachingSessionsUseCaseResponse> => {
            return {
                success: true,
                data: listStudentCoachingSessionsMock,
            };
        },
    );
