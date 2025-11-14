import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';
import { z } from 'zod';

// TODO: Update mock data structure to match final backend response format
const listGroupCoachingSessionsMock: any = {
    sessions: [
        {
            id: 1001,
            sessionName: 'Advanced Design Principles',
            startTime: '2025-11-08T10:00:00Z',
            endTime: '2025-11-08T11:30:00Z',
            sessionDate: '2025-11-08T10:00:00Z',
            groupId: 1,
            groupName: 'Design Professionals',
            course: {
                id: 101,
                title: 'UI/UX Design Fundamentals',
                slug: 'ui-ux-design-fundamentals'
            },
            rating: 4.8,
            participantsCount: 8,
            maxParticipants: 10,
            status: 'scheduled',
        },
        {
            id: 1002,
            sessionName: 'User Research Workshop',
            startTime: '2025-11-12T14:00:00Z',
            endTime: '2025-11-12T15:30:00Z',
            sessionDate: '2025-11-12T14:00:00Z',
            groupId: 1,
            groupName: 'Design Professionals',
            course: {
                id: 101,
                title: 'UI/UX Design Fundamentals',
                slug: 'ui-ux-design-fundamentals'
            },
            rating: 4.9,
            participantsCount: 9,
            maxParticipants: 10,
            status: 'scheduled',
        },
        {
            id: 1003,
            sessionName: 'Prototyping Techniques',
            startTime: '2025-11-18T15:30:00Z',
            endTime: '2025-11-18T17:00:00Z',
            sessionDate: '2025-11-18T15:30:00Z',
            groupId: 2,
            groupName: 'Marketing Team',
            course: {
                id: 102,
                title: 'Digital Marketing Strategy',
                slug: 'digital-marketing-strategy'
            },
            rating: null,
            participantsCount: 0,
            maxParticipants: 8,
            status: 'scheduled',
        },
        {
            id: 1004,
            sessionName: 'Agile Development Q&A',
            startTime: '2025-11-22T09:00:00Z',
            endTime: '2025-11-22T10:30:00Z',
            sessionDate: '2025-11-22T09:00:00Z',
            groupId: 3,
            groupName: 'Development Squad',
            course: {
                id: 103,
                title: 'Agile Project Management',
                slug: 'agile-project-management'
            },
            rating: null, // No rating yet
            participantsCount: 0, // Not started yet
            maxParticipants: 12,
            status: 'scheduled',
        },
    ],
};

// TODO: Update mock data structure to match final backend response format
const listCoachCoachingSessionsMock: any = {
    sessions: [
        {
            id: 2001,
            coachingOfferingTitle: 'Quick Sprint',
            startTime: '2025-11-09T09:00:00Z',
            endTime: '2025-11-09T09:20:00Z',
            status: 'scheduled',
            studentName: 'Alice Johnson',
            courseName: 'React Development',
        },
        {
            id: 2002,
            coachingOfferingTitle: 'Normal Sprint',
            startTime: '2025-11-14T14:00:00Z',
            endTime: '2025-11-14T14:30:00Z',
            status: 'scheduled',
            studentName: 'Bob Smith',
            courseName: 'Vue.js Fundamentals',
        },
        {
            id: 2003,
            coachingOfferingTitle: 'Full Immersion',
            startTime: '2025-11-16T10:00:00Z',
            endTime: '2025-11-16T11:00:00Z',
            status: 'scheduled',
            studentName: 'Charlie Brown',
            courseName: 'Advanced JavaScript',
        },
        {
            id: 2004,
            coachingOfferingTitle: 'Normal Sprint',
            startTime: '2025-11-20T16:00:00Z',
            endTime: '2025-11-20T16:30:00Z',
            status: 'requested',
            studentName: 'Diana Wilson',
            courseName: 'TypeScript Essentials',
        },
        {
            id: 2005,
            coachingOfferingTitle: 'Quick Sprint',
            startTime: '2025-11-24T11:00:00Z',
            endTime: '2025-11-24T11:20:00Z',
            status: 'scheduled',
            studentName: 'Eva Rodriguez',
            courseName: 'Node.js Backend Development',
        },
    ],
};

export const listGroupCoachingSessions = t.procedure
    .input(
        // Using a generic schema since the exact schema might not be available
        z.object({
            groupId: z.number().optional(),
        }).optional()
    )
    .query(async (): Promise<any> => {
        return {
            success: true,
            data: listGroupCoachingSessionsMock,
        };
    });

export const listCoachCoachingSessions = t.procedure
    .input(z.object({}).optional())
    .query(async (): Promise<any> => {
        return {
            success: true,
            data: listCoachCoachingSessionsMock,
        };
    });

// TODO: Wire up createGroupCoachingSession usecase when ready - currently MOCK implementation
// Mock for createGroupCoachingSession - alerts the input data as requested in PR description
export const createGroupCoachingSession = t.procedure
    .input(
        z.object({
            startTime: z.string(),
            coachingOfferingId: z.number(),
            coachingOfferingName: z.string(),
            coachingOfferingDuration: z.number(),
            endTime: z.string(),
        })
    )
    .mutation(async (opts): Promise<any> => {
        const inputData = opts.input;
        
        // Alert the input data as requested in PR description
        console.log('TODO: Wire up createGroupCoachingSession with data:', JSON.stringify(inputData, null, 2));
        alert(`TODO: Wire up createGroupCoachingSession\nInput data: ${JSON.stringify(inputData, null, 2)}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            data: {
                sessionId: Math.floor(Math.random() * 10000), // Mock session ID
                message: 'Group coaching session created successfully (MOCK)',
            },
        };
    });