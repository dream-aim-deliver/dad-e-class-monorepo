import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCoachAvailabilityMock: useCaseModels.TGetCoachAvailabilitySuccessResponse['data'] =
{
    availability: [
        // September 29th - fragmented slots
        {
            startTime: '2025-09-29T08:17:00Z',
            endTime: '2025-09-29T10:43:00Z', // Overlaps with session 1001
        },
        {
            startTime: '2025-09-29T15:25:00Z',
            endTime: '2025-09-29T17:52:00Z', // Overlaps with session 1008
        },

        // September 30th - fragmented slots
        {
            startTime: '2025-09-30T08:08:00Z',
            endTime: '2025-09-30T11:47:00Z', // Overlaps with session 1009
        },
        {
            startTime: '2025-09-30T13:23:00Z',
            endTime: '2025-09-30T15:56:00Z', // Overlaps with session 1002
        },
        {
            startTime: '2025-09-30T17:14:00Z',
            endTime: '2025-09-30T19:03:00Z',
        },

        // October 1st - fragmented slots
        {
            startTime: '2025-10-01T08:12:00Z',
            endTime: '2025-10-01T11:37:00Z', // Overlaps with session 1003
        },
        {
            startTime: '2025-10-01T13:05:00Z',
            endTime: '2025-10-01T16:28:00Z', // Overlaps with session 1010
        },
        {
            startTime: '2025-10-01T18:11:00Z',
            endTime: '2025-10-01T19:49:00Z',
        },

        // October 2nd - fragmented slots
        {
            startTime: '2025-10-02T09:07:00Z',
            endTime: '2025-10-02T11:54:00Z',
        },
        {
            startTime: '2025-10-02T12:38:00Z',
            endTime: '2025-10-02T16:13:00Z', // Overlaps with sessions 1004 and 1011
        },
        {
            startTime: '2025-10-02T17:22:00Z',
            endTime: '2025-10-02T19:41:00Z',
        },

        // October 3rd - fragmented slots
        {
            startTime: '2025-10-03T08:29:00Z',
            endTime: '2025-10-03T12:58:00Z', // Overlaps with session 1012
        },
        {
            startTime: '2025-10-03T14:35:00Z',
            endTime: '2025-10-03T17:26:00Z', // Overlaps with session 1005
        },
        {
            startTime: '2025-10-03T18:09:00Z',
            endTime: '2025-10-03T19:57:00Z',
        },

        // October 4th - fragmented slots
        {
            startTime: '2025-10-04T09:16:00Z',
            endTime: '2025-10-04T13:24:00Z', // Overlaps with session 1006
        },
        {
            startTime: '2025-10-04T14:03:00Z',
            endTime: '2025-10-04T17:51:00Z', // Overlaps with session 1013
        },

        // October 5th - fragmented slots
        {
            startTime: '2025-10-05T08:04:00Z',
            endTime: '2025-10-05T11:46:00Z', // Overlaps with sessions 1007 and 1014
        },
        {
            startTime: '2025-10-05T13:33:00Z',
            endTime: '2025-10-05T16:27:00Z', // Overlaps with session 1015
        },
        {
            startTime: '2025-10-05T17:08:00Z',
            endTime: '2025-10-05T18:55:00Z',
        },
    ],
    mySessions: [
        {
            id: 1001,
            status: 'completed',
            coachingOfferingName: 'Leadership Development',
            startTime: '2025-09-29T09:00:00Z',
            endTime: '2025-09-29T10:00:00Z',
        },
        {
            id: 1002,
            status: 'completed',
            coachingOfferingName: 'Communication Skills',
            startTime: '2025-09-30T14:00:00Z',
            endTime: '2025-09-30T15:00:00Z',
        },
        {
            id: 1003,
            status: 'accepted',
            coachingOfferingName: 'Time Management',
            startTime: '2025-10-01T10:00:00Z',
            endTime: '2025-10-01T11:00:00Z',
        },
        {
            id: 1004,
            status: 'completed',
            coachingOfferingName: 'Conflict Resolution',
            startTime: '2025-10-02T13:00:00Z',
            endTime: '2025-10-02T14:00:00Z',
        },
        {
            id: 1005,
            status: 'requested',
            coachingOfferingName: 'Career Planning',
            startTime: '2025-10-03T15:00:00Z',
            endTime: '2025-10-03T16:00:00Z',
        },
        {
            id: 1006,
            status: 'completed',
            coachingOfferingName: 'Public Speaking',
            startTime: '2025-10-04T11:00:00Z',
            endTime: '2025-10-04T12:00:00Z',
        },
        {
            id: 1007,
            status: 'accepted',
            coachingOfferingName: 'Team Building',
            startTime: '2025-10-05T09:00:00Z',
            endTime: '2025-10-05T10:00:00Z',
        },
        {
            id: 1008,
            status: 'completed',
            coachingOfferingName: 'Stress Management',
            startTime: '2025-09-29T16:00:00Z',
            endTime: '2025-09-29T17:00:00Z',
        },
        {
            id: 1009,
            status: 'unscheduled',
            coachingOfferingName: 'Goal Setting',
            startTime: '2025-09-30T10:00:00Z',
            endTime: '2025-09-30T11:00:00Z',
        },
        {
            id: 1010,
            status: 'requested',
            coachingOfferingName: 'Decision Making',
            startTime: '2025-10-01T14:00:00Z',
            endTime: '2025-10-01T15:00:00Z',
        },
        {
            id: 1011,
            status: 'completed',
            coachingOfferingName: 'Emotional Intelligence',
            startTime: '2025-10-02T13:00:00Z',
            endTime: '2025-10-02T14:00:00Z',
        },
        {
            id: 1012,
            status: 'accepted',
            coachingOfferingName: 'Performance Review Prep',
            startTime: '2025-10-03T11:00:00Z',
            endTime: '2025-10-03T12:00:00Z',
        },
        {
            id: 1013,
            status: 'completed',
            coachingOfferingName: 'Innovation Workshop',
            startTime: '2025-10-04T15:00:00Z',
            endTime: '2025-10-04T16:00:00Z',
        },
        {
            id: 1014,
            status: 'requested',
            coachingOfferingName: 'Work-Life Balance',
            startTime: '2025-10-05T10:00:00Z',
            endTime: '2025-10-05T11:00:00Z',
        },
        {
            id: 1015,
            status: 'unscheduled',
            coachingOfferingName: 'Executive Presence',
            startTime: '2025-10-05T14:00:00Z',
            endTime: '2025-10-05T15:00:00Z',
        },
    ],
};

export const getCoachAvailability = t.procedure
    .input(useCaseModels.GetCoachAvailabilityRequestSchema)
    .query(
        async (): Promise<useCaseModels.TGetCoachAvailabilityUseCaseResponse> => {
            return {
                success: true,
                data: getCoachAvailabilityMock,
            };
        },
    );
