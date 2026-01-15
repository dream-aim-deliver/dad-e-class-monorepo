import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// In-memory storage for session reviews to simulate backend state
const sessionReviews: Record<number, { rating: number; comment: string | null }> = {};

// In-memory storage for session status changes to simulate backend state
const sessionStatusChanges: Record<number, 'unscheduled' | 'cancelled'> = {};

const listStudentCoachingSessionsMock: useCaseModels.TListStudentCoachingSessionsSuccessResponse['data'] = {
    sessions: [
        // Unscheduled sessions (for Available tab)
        {
            id: 1,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'unscheduled'
        },
        {
            id: 2,
            coachingOfferingTitle: 'Quick Sprint',
            coachingOfferingDuration: 20,
            status: 'unscheduled'
        },
        {
            id: 19,
            coachingOfferingTitle: 'Full Immersion',
            coachingOfferingDuration: 60,
            status: 'unscheduled'
        },

        // UPCOMING TAB SESSIONS

        // 1. REQUESTED status - Sessions awaiting coach approval
        {
            id: 3,
            coachingOfferingTitle: 'Full Immersion',
            coachingOfferingDuration: 60,
            status: 'requested',
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
        },
        {
            id: 7,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'requested',
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
        },

        // 2. ONGOING status - Sessions happening right now (simulate with recent past start, future end)
        {
            id: 4,
            coachingOfferingTitle: 'Quick Sprint',
            coachingOfferingDuration: 20,
            status: 'scheduled',
            startTime: '2025-09-23T14:00:00+00:00', // Started recently
            endTime: '2025-09-23T14:20:00+00:00', // Ends soon
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

        // 3. UPCOMING-EDITABLE status - Sessions more than 24 hours away
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
        {
            id: 10,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'scheduled',
            startTime: '2025-09-29T15:00:00+00:00', // More than 24 hours away
            endTime: '2025-09-29T15:30:00+00:00',
            coach: {
                name: 'Lisa',
                surname: 'Anderson',
                username: 'lisa_anderson',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 108,
                title: 'TypeScript Advanced Course',
                slug: 'typescript-advanced-course'
            },
            meetingUrl: 'https://meet.example.com/session-10'
        },

        // 4. UPCOMING-LOCKED status - Sessions within 24 hours but not yet started
        {
            id: 9,
            coachingOfferingTitle: 'Full Immersion',
            coachingOfferingDuration: 60,
            status: 'scheduled',
            startTime: '2025-09-24T09:00:00+00:00', // Within 24 hours
            endTime: '2025-09-24T10:00:00+00:00',
            coach: {
                name: 'David',
                surname: 'Miller',
                username: 'david_miller',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 107,
                title: 'GraphQL Fundamentals',
                slug: 'graphql-fundamentals'
            },
            meetingUrl: 'https://meet.example.com/session-9'
        },
        {
            id: 11,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'scheduled',
            startTime: '2025-09-24T16:00:00+00:00', // Within 24 hours
            endTime: '2025-09-24T16:30:00+00:00',
            coach: {
                name: 'Robert',
                surname: 'Taylor',
                username: 'robert_taylor',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 109,
                title: 'DevOps with Docker',
                slug: 'devops-with-docker'
            },
            meetingUrl: 'https://meet.example.com/session-11'
        },

        // ENDED TAB SESSIONS - Completed sessions
        {
            id: 5,
            coachingOfferingTitle: 'Full Immersion',
            coachingOfferingDuration: 60,
            status: 'completed',
            startTime: '2025-09-15T10:00:00+00:00', // Past date
            endTime: '2025-09-15T11:00:00+00:00',
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
            // review: {
            //     rating: 5,
            //     comment: 'Excellent session! Very helpful and clear explanations.'
            // }
        },
        {
            id: 6,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'completed',
            startTime: '2025-09-10T14:00:00+00:00', // Past date
            endTime: '2025-09-10T14:30:00+00:00',
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
            // review: {
            //     rating: 4,
            //     comment: 'Good session, covered all the important concepts.'
            // }
        },
        {
            id: 13,
            coachingOfferingTitle: 'Quick Sprint',
            coachingOfferingDuration: 20,
            status: 'completed',
            startTime: '2025-09-12T11:00:00+00:00', // Past date
            endTime: '2025-09-12T11:20:00+00:00',
            coach: {
                name: 'Kevin',
                surname: 'White',
                username: 'kevin_white',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 111,
                title: 'NoSQL Database Systems',
                slug: 'nosql-database-systems'
            },
            review: {
                rating: 5,
                comment: 'Fantastic session! Really helped me understand MongoDB architecture.'
            }
        },
        {
            id: 15,
            coachingOfferingTitle: 'Normal Sprint',
            coachingOfferingDuration: 30,
            status: 'completed',
            startTime: '2025-09-05T09:00:00+00:00', // Past date
            endTime: '2025-09-05T09:30:00+00:00',
            coach: {
                name: 'Tom',
                surname: 'Clark',
                username: 'tom_clark',
                avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 113,
                title: 'Git and GitHub Mastery',
                slug: 'git-github-mastery'
            }
            // No review for this session (to test ended without review) - This is where you can add a review!
        }
    ]
};

// Function to update session with review (called from create-coaching-session-review.ts)
export const updateSessionWithReview = (sessionId: number, rating: number, comment: string | null) => {
    sessionReviews[sessionId] = { rating, comment };
};

// Function to update session status (called from unschedule-coaching-session.ts)
export const updateSessionStatus = (sessionId: number, status: 'unscheduled' | 'cancelled') => {
    sessionStatusChanges[sessionId] = status;
};

// Function to get session data (for use by other procedures)
export const getSessionById = (sessionId: number) => {
    return listStudentCoachingSessionsMock.sessions.find(session => session.id === sessionId);
};

export const listStudentCoachingSessions = t.procedure
    .input(useCaseModels.ListStudentCoachingSessionsRequestSchema)
    .query(
        async (): Promise<useCaseModels.TListStudentCoachingSessionsUseCaseResponse> => {
            // Apply any dynamic status changes (cancellations/unscheduling)
            const sessionsWithStatusChanges = listStudentCoachingSessionsMock.sessions
                .map(session => {
                    const statusChange = sessionStatusChanges[session.id];
                    if (statusChange === 'unscheduled') {
                        // Convert the session to unscheduled status and remove scheduling-specific fields
                        return {
                            id: session.id,
                            coachingOfferingTitle: session.coachingOfferingTitle,
                            coachingOfferingDuration: session.coachingOfferingDuration,
                            status: 'unscheduled' as const
                        };
                    } else if (statusChange === 'cancelled') {
                        // Filter out cancelled sessions (don't return them)
                        return null;
                    }
                    return session;
                })
                .filter((session): session is NonNullable<typeof session> => session !== null);

            // Apply any dynamic reviews that were created
            const sessionsWithUpdatedReviews = sessionsWithStatusChanges.map(session => {
                const dynamicReview = sessionReviews[session.id];
                if (dynamicReview && session.status === 'completed') {
                    return {
                        ...session,
                        review: {
                            rating: dynamicReview.rating,
                            comment: dynamicReview.comment
                        }
                    };
                }
                return session;
            });

            return {
                success: true,
                data: {
                    sessions: sessionsWithUpdatedReviews
                },
            };
        },
    );