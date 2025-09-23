import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

// Mock data for notifications with realistic e-learning scenarios
const listNotificationsMock: (useCaseModels.TNotification & { id: number })[] = [
    {
        id: 1,
        message: 'Coach John Doe accepted your request to reschedule the coaching session to Friday 2:00 PM.',
        action: {
            title: 'Session details',
            url: '/coaching-sessions/123'
        },
        timestamp: '2025-09-23T14:30:00+00:00',
        isRead: false
    },
    {
        id: 2,
        message: 'Your assignment in "Python Programming Masterclass" has been graded by Coach Alice Smith.',
        action: {
            title: 'View assignment',
            url: '/courses/python-programming-masterclass/assignments/456'
        },
        timestamp: '2025-09-22T18:15:00+00:00',
        isRead: false
    },
    {
        id: 3,
        message: 'New course material uploaded in "Backend Development with Node.js" - Chapter 5: Database Integration.',
        action: {
            title: 'View materials',
            url: '/courses/backend-development-nodejs/materials'
        },
        timestamp: '2025-09-22T10:45:00+00:00',
        isRead: true
    },
    {
        id: 4,
        message: 'Coach Emma Davis suggested a new date for your upcoming coaching session.',
        action: {
            title: 'Respond to suggestion',
            url: '/coaching-sessions/789/reschedule'
        },
        timestamp: '2025-09-21T16:20:00+00:00',
        isRead: true
    },
    {
        id: 5,
        message: 'Your course completion certificate for "Advanced React Development" is ready for download.',
        action: {
            title: 'Download certificate',
            url: '/certificates/advanced-react-development'
        },
        timestamp: '2025-09-21T09:30:00+00:00',
        isRead: false
    },
    {
        id: 6,
        message: 'Coach Michael Johnson declined your session request. Alternative dates have been suggested.',
        action: {
            title: 'View alternatives',
            url: '/coaching-sessions/101/alternatives'
        },
        timestamp: '2025-09-20T13:45:00+00:00',
        isRead: true
    },
    {
        id: 7,
        message: 'Reminder: Your coaching session with Coach Sarah Wilson starts in 1 hour.',
        action: {
            title: 'Join meeting',
            url: 'https://meet.example.com/session-7'
        },
        timestamp: '2025-09-20T11:00:00+00:00',
        isRead: false
    },
    {
        id: 8,
        message: 'New quiz available in "Data Science Fundamentals" - Test your knowledge of machine learning basics.',
        action: {
            title: 'Take quiz',
            url: '/courses/data-science-fundamentals/quizzes/ml-basics'
        },
        timestamp: '2025-09-19T15:30:00+00:00',
        isRead: true
    },
    {
        id: 9,
        message: 'Your peer review assignment has been submitted successfully. Await feedback from your classmates.',
        action: null,
        timestamp: '2025-09-19T12:15:00+00:00',
        isRead: true
    },
    {
        id: 10,
        message: 'Coach Alex Brown shared new resources for your upcoming presentation on web security.',
        action: {
            title: 'Access resources',
            url: '/courses/web-security/resources/presentation-materials'
        },
        timestamp: '2025-09-18T08:45:00+00:00',
        isRead: false
    }
];

export const listNotifications = t.procedure
    .input(useCaseModels.ListNotificationsRequestSchema)
    .query(
        async (opts): Promise<useCaseModels.TListNotificationsUseCaseResponse> => {
            const { pagination } = opts.input;
            
            // Extract pagination values with defaults
            const pageSize = pagination?.pageSize || 10;
            const page = pagination?.page || 1;
            const offset = (page - 1) * pageSize;
            
            // Simulate pagination
            const paginatedNotifications = listNotificationsMock.slice(offset, offset + pageSize);
            
            return {
                success: true,
                data: {
                    notifications: paginatedNotifications
                }
            };
        }
    );