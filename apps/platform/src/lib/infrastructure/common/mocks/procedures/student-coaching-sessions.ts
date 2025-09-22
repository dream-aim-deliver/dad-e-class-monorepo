import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// Helper function to create dynamic dates for testing different UI statuses
const createDate = (hoursFromNow: number): string => {
    const now = new Date();
    const targetDate = new Date(now.getTime() + (hoursFromNow * 60 * 60 * 1000));
    return targetDate.toISOString();
};

const listStudentCoachingSessionsMock: useCaseModels.TListStudentCoachingSessionsSuccessResponse['data'] = {
    sessions: [
        // Unscheduled sessions (for Available tab)
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
            id: 19,
            coachingOfferingTitle: 'UI/UX Design Principles',
            coachingOfferingDuration: 60,
            status: 'unscheduled'
        },

        // UPCOMING TAB SESSIONS - These will show different UI statuses

        // 1. REQUESTED status - Sessions awaiting coach approval
        {
            id: 3,
            coachingOfferingTitle: 'Python Data Structures',
            coachingOfferingDuration: 60,
            status: 'requested',
            startTime: createDate(48), // 2 days from now
            endTime: createDate(49), // 2 days + 1 hour from now
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
            coachingOfferingTitle: 'Node.js Backend Development',
            coachingOfferingDuration: 50,
            status: 'requested',
            startTime: createDate(72), // 3 days from now
            endTime: createDate(72.83), // 3 days + 50 minutes from now
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

        // 2. ONGOING status - Sessions happening right now
        {
            id: 4,
            coachingOfferingTitle: 'Web Development Best Practices',
            coachingOfferingDuration: 45,
            status: 'scheduled',
            startTime: createDate(-0.25), // Started 15 minutes ago
            endTime: createDate(0.5), // Ends in 30 minutes
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
            id: 20,
            coachingOfferingTitle: 'Database Optimization Techniques',
            coachingOfferingDuration: 60,
            status: 'scheduled',
            startTime: createDate(-0.1), // Started 6 minutes ago
            endTime: createDate(0.9), // Ends in 54 minutes
            coach: {
                name: 'Daniel',
                surname: 'Wilson',
                username: 'daniel_wilson',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 120,
                title: 'Advanced Database Systems',
                slug: 'advanced-database-systems'
            },
            meetingUrl: 'https://meet.example.com/session-20'
        },

        // 3. UPCOMING-EDITABLE status - Sessions more than 24 hours away
        {
            id: 8,
            coachingOfferingTitle: 'React Hooks Deep Dive',
            coachingOfferingDuration: 45,
            status: 'scheduled',
            startTime: createDate(36), // 36 hours from now (1.5 days)
            endTime: createDate(36.75), // 36 hours + 45 minutes from now
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
            coachingOfferingTitle: 'TypeScript Best Practices',
            coachingOfferingDuration: 40,
            status: 'scheduled',
            startTime: createDate(50), // ~2 days from now
            endTime: createDate(50.67), // ~2 days + 40 minutes from now
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
            coachingOfferingTitle: 'GraphQL API Design',
            coachingOfferingDuration: 60,
            status: 'scheduled',
            startTime: createDate(12), // 12 hours from now
            endTime: createDate(13), // 13 hours from now
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
            coachingOfferingTitle: 'Docker Container Management',
            coachingOfferingDuration: 55,
            status: 'scheduled',
            startTime: createDate(6), // 6 hours from now
            endTime: createDate(6.92), // 6 hours + 55 minutes from now
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
            coachingOfferingTitle: 'Algorithm Design Session',
            coachingOfferingDuration: 60,
            status: 'completed',
            startTime: createDate(-168), // 1 week ago
            endTime: createDate(-167), // 1 week ago + 1 hour
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
            startTime: createDate(-240), // 10 days ago
            endTime: createDate(-238.5), // 10 days ago + 1.5 hours
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
        },
        {
            id: 13,
            coachingOfferingTitle: 'MongoDB Database Design',
            coachingOfferingDuration: 65,
            status: 'completed',
            startTime: createDate(-192), // 8 days ago
            endTime: createDate(-190.92), // 8 days ago + 65 minutes
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
            coachingOfferingTitle: 'Git Version Control Advanced',
            coachingOfferingDuration: 50,
            status: 'completed',
            startTime: createDate(-432), // 18 days ago
            endTime: createDate(-431.17), // 18 days ago + 50 minutes
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
            // No review for this session (to test ended without review)
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