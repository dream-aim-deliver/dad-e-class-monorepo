import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCoachAvailabilityMock: useCaseModels.TGetCoachAvailabilitySuccessResponse['data'] =
{
    availability: [
        // Single availability slots
        {
            type: 'single',
            startTime: '2025-09-30T09:00:00Z',
            endTime: '2025-09-30T10:00:00Z',
        },
        {
            type: 'single',
            startTime: '2025-10-02T14:00:00Z',
            endTime: '2025-10-02T15:30:00Z',
        },
        {
            type: 'single',
            startTime: '2025-10-03T11:00:00Z',
            endTime: '2025-10-03T12:00:00Z',
        },
        {
            type: 'single',
            startTime: '2025-10-04T16:00:00Z',
            endTime: '2025-10-04T17:00:00Z',
        },
        {
            type: 'single',
            startTime: '2025-10-05T10:00:00Z',
            endTime: '2025-10-05T11:30:00Z',
        },
        // Recurring availability slots
        {
            type: 'recurring',
            startTime: '2025-09-29T08:00:00Z',
            endTime: '2025-09-29T09:00:00Z',
            monday: true,
            tuesday: false,
            wednesday: true,
            thursday: false,
            friday: true,
            saturday: false,
            sunday: false,
            createdAt: '2025-09-22T10:00:00Z',
            expirationDate: '2025-10-31T23:59:59Z',
        },
        {
            type: 'recurring',
            startTime: '2025-09-29T13:00:00Z',
            endTime: '2025-09-29T14:00:00Z',
            monday: false,
            tuesday: true,
            wednesday: false,
            thursday: true,
            friday: false,
            saturday: true,
            sunday: false,
            createdAt: '2025-09-25T14:30:00Z',
            expirationDate: '2025-11-15T23:59:59Z',
        },
        {
            type: 'recurring',
            startTime: '2025-09-29T15:30:00Z',
            endTime: '2025-09-29T16:30:00Z',
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: true,
            createdAt: '2025-09-27T12:00:00Z',
            expirationDate: '2025-10-31T23:59:59Z',
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
    anonymousSessions: [
        {
            startTime: '2025-09-29T10:00:00Z',
            endTime: '2025-09-29T11:00:00Z',
        },
        {
            startTime: '2025-09-30T13:00:00Z',
            endTime: '2025-09-30T14:00:00Z',
        },
        {
            startTime: '2025-10-01T15:00:00Z',
            endTime: '2025-10-01T16:00:00Z',
        },
        {
            startTime: '2025-10-01T09:00:00Z',
            endTime: '2025-10-01T10:00:00Z',
        },
        {
            startTime: '2025-10-02T14:00:00Z',
            endTime: '2025-10-02T15:00:00Z',
        },
        {
            startTime: '2025-10-03T11:00:00Z',
            endTime: '2025-10-03T12:00:00Z',
        },
        {
            startTime: '2025-10-03T16:00:00Z',
            endTime: '2025-10-03T17:00:00Z',
        },
        {
            startTime: '2025-10-04T10:00:00Z',
            endTime: '2025-10-04T11:00:00Z',
        },
        {
            startTime: '2025-10-04T13:00:00Z',
            endTime: '2025-10-04T14:00:00Z',
        },
        {
            startTime: '2025-10-05T15:00:00Z',
            endTime: '2025-10-05T16:00:00Z',
        },
        {
            startTime: '2025-09-29T09:00:00Z',
            endTime: '2025-09-29T10:00:00Z',
        },
        {
            startTime: '2025-09-30T12:00:00Z',
            endTime: '2025-09-30T13:00:00Z',
        },
        {
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
