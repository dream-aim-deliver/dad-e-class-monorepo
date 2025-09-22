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
        },
        // Additional upcoming sessions (requested)
        {
            id: 7,
            coachingOfferingTitle: 'Node.js Backend Development',
            coachingOfferingDuration: 50,
            status: 'requested',
            startTime: '2025-01-25T09:00:00+00:00',
            endTime: '2025-01-25T09:50:00+00:00',
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
        {
            id: 8,
            coachingOfferingTitle: 'React Hooks Deep Dive',
            coachingOfferingDuration: 45,
            status: 'requested',
            startTime: '2025-01-26T11:00:00+00:00',
            endTime: '2025-01-26T11:45:00+00:00',
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
            id: 9,
            coachingOfferingTitle: 'GraphQL API Design',
            coachingOfferingDuration: 60,
            status: 'requested',
            startTime: '2025-01-27T15:00:00+00:00',
            endTime: '2025-01-27T16:00:00+00:00',
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
        // Additional upcoming sessions (scheduled)
        {
            id: 10,
            coachingOfferingTitle: 'TypeScript Best Practices',
            coachingOfferingDuration: 40,
            status: 'scheduled',
            startTime: '2025-01-23T10:00:00+00:00',
            endTime: '2025-01-23T10:40:00+00:00',
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
        {
            id: 11,
            coachingOfferingTitle: 'Docker Container Management',
            coachingOfferingDuration: 55,
            status: 'scheduled',
            startTime: '2025-01-24T14:00:00+00:00',
            endTime: '2025-01-24T14:55:00+00:00',
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
        {
            id: 12,
            coachingOfferingTitle: 'AWS Cloud Architecture',
            coachingOfferingDuration: 75,
            status: 'scheduled',
            startTime: '2025-01-28T13:00:00+00:00',
            endTime: '2025-01-28T14:15:00+00:00',
            coach: {
                name: 'Maria',
                surname: 'Garcia',
                username: 'maria_garcia',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 110,
                title: 'Cloud Computing with AWS',
                slug: 'cloud-computing-aws'
            },
            meetingUrl: 'https://meet.example.com/session-12'
        },
        // Additional ended sessions (completed)
        {
            id: 13,
            coachingOfferingTitle: 'MongoDB Database Design',
            coachingOfferingDuration: 65,
            status: 'completed',
            startTime: '2025-01-12T09:00:00+00:00',
            endTime: '2025-01-12T10:05:00+00:00',
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
            id: 14,
            coachingOfferingTitle: 'CSS Grid and Flexbox',
            coachingOfferingDuration: 40,
            status: 'completed',
            startTime: '2025-01-08T16:00:00+00:00',
            endTime: '2025-01-08T16:40:00+00:00',
            coach: {
                name: 'Jessica',
                surname: 'Lee',
                username: 'jessica_lee',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 112,
                title: 'Modern CSS Techniques',
                slug: 'modern-css-techniques'
            },
            review: {
                rating: 4,
                comment: 'Good overview of modern CSS layout techniques.'
            }
        },
        {
            id: 15,
            coachingOfferingTitle: 'Git Version Control Advanced',
            coachingOfferingDuration: 50,
            status: 'completed',
            startTime: '2025-01-05T11:00:00+00:00',
            endTime: '2025-01-05T11:50:00+00:00',
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
            // No review for this session
        },
        {
            id: 16,
            coachingOfferingTitle: 'Vue.js Component Architecture',
            coachingOfferingDuration: 55,
            status: 'completed',
            startTime: '2025-01-03T14:00:00+00:00',
            endTime: '2025-01-03T14:55:00+00:00',
            coach: {
                name: 'Nancy',
                surname: 'Adams',
                username: 'nancy_adams',
                avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 114,
                title: 'Vue.js Complete Guide',
                slug: 'vuejs-complete-guide'
            },
            review: {
                rating: 5,
                comment: 'Excellent session on Vue.js components. Very practical examples.'
            }
        },
        {
            id: 17,
            coachingOfferingTitle: 'REST API Development',
            coachingOfferingDuration: 70,
            status: 'completed',
            startTime: '2024-12-28T10:00:00+00:00',
            endTime: '2024-12-28T11:10:00+00:00',
            coach: {
                name: 'Brian',
                surname: 'Rodriguez',
                username: 'brian_rodriguez',
                avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 115,
                title: 'API Development Fundamentals',
                slug: 'api-development-fundamentals'
            },
            review: {
                rating: 4,
                comment: 'Solid introduction to REST API principles and implementation.'
            }
        },
        {
            id: 18,
            coachingOfferingTitle: 'Microservices Architecture',
            coachingOfferingDuration: 80,
            status: 'completed',
            startTime: '2024-12-25T15:00:00+00:00',
            endTime: '2024-12-25T16:20:00+00:00',
            coach: {
                name: 'Rachel',
                surname: 'Martinez',
                username: 'rachel_martinez',
                avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80'
            },
            course: {
                id: 116,
                title: 'Enterprise Software Architecture',
                slug: 'enterprise-software-architecture'
            }
            // No review for this session
        },
        {
            id: 19,
            coachingOfferingTitle: 'JavaScript Fundamentals Session',
            coachingOfferingDuration: 30,
            status: 'unscheduled'
        },
        {
            id: 20,
            coachingOfferingTitle: 'React Advanced Concepts',
            coachingOfferingDuration: 45,
            status: 'unscheduled'
        },
        {
            id: 21,
            coachingOfferingTitle: 'UI/UX Design Principles',
            coachingOfferingDuration: 60,
            status: 'unscheduled'
        },
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
