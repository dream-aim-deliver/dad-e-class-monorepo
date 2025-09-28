import { useCaseModels } from '@maany_shr/e-class-models';
import { t } from '../trpc-setup';

const getCoachAvailabilityMock: useCaseModels.TGetCoachAvailabilitySuccessResponse['data'] =
    {
        availability: [
            // Single availability slots
            {
                type: 'single',
                startTime: '2025-07-02T09:00:00Z',
                endTime: '2025-07-02T10:00:00Z',
            },
            {
                type: 'single',
                startTime: '2025-07-05T14:00:00Z',
                endTime: '2025-07-05T15:30:00Z',
            },
            {
                type: 'single',
                startTime: '2025-07-08T11:00:00Z',
                endTime: '2025-07-08T12:00:00Z',
            },
            {
                type: 'single',
                startTime: '2025-07-15T16:00:00Z',
                endTime: '2025-07-15T17:00:00Z',
            },
            {
                type: 'single',
                startTime: '2025-07-22T10:00:00Z',
                endTime: '2025-07-22T11:30:00Z',
            },
            // Recurring availability slots
            {
                type: 'recurring',
                startTime: '2025-07-01T08:00:00Z',
                endTime: '2025-07-01T09:00:00Z',
                monday: true,
                tuesday: false,
                wednesday: true,
                thursday: false,
                friday: true,
                saturday: false,
                sunday: false,
                createdAt: '2025-06-25T10:00:00Z',
                expirationDate: '2025-07-31T23:59:59Z',
            },
            {
                type: 'recurring',
                startTime: '2025-07-01T13:00:00Z',
                endTime: '2025-07-01T14:00:00Z',
                monday: false,
                tuesday: true,
                wednesday: false,
                thursday: true,
                friday: false,
                saturday: true,
                sunday: false,
                createdAt: '2025-06-28T14:30:00Z',
                expirationDate: '2025-08-15T23:59:59Z',
            },
            {
                type: 'recurring',
                startTime: '2025-07-01T15:30:00Z',
                endTime: '2025-07-01T16:30:00Z',
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: true,
                createdAt: '2025-06-30T12:00:00Z',
                expirationDate: '2025-07-31T23:59:59Z',
            },
        ],
        mySessions: [
            {
                id: 1001,
                status: 'completed',
                coachingOfferingName: 'Leadership Development',
                startTime: '2025-07-01T09:00:00Z',
                endTime: '2025-07-01T10:00:00Z',
            },
            {
                id: 1002,
                status: 'completed',
                coachingOfferingName: 'Communication Skills',
                startTime: '2025-07-03T14:00:00Z',
                endTime: '2025-07-03T15:00:00Z',
            },
            {
                id: 1003,
                status: 'accepted',
                coachingOfferingName: 'Time Management',
                startTime: '2025-07-07T10:00:00Z',
                endTime: '2025-07-07T11:00:00Z',
            },
            {
                id: 1004,
                status: 'completed',
                coachingOfferingName: 'Conflict Resolution',
                startTime: '2025-07-09T13:00:00Z',
                endTime: '2025-07-09T14:00:00Z',
            },
            {
                id: 1005,
                status: 'requested',
                coachingOfferingName: 'Career Planning',
                startTime: '2025-07-11T15:00:00Z',
                endTime: '2025-07-11T16:00:00Z',
            },
            {
                id: 1006,
                status: 'completed',
                coachingOfferingName: 'Public Speaking',
                startTime: '2025-07-12T11:00:00Z',
                endTime: '2025-07-12T12:00:00Z',
            },
            {
                id: 1007,
                status: 'accepted',
                coachingOfferingName: 'Team Building',
                startTime: '2025-07-14T09:00:00Z',
                endTime: '2025-07-14T10:00:00Z',
            },
            {
                id: 1008,
                status: 'completed',
                coachingOfferingName: 'Stress Management',
                startTime: '2025-07-16T16:00:00Z',
                endTime: '2025-07-16T17:00:00Z',
            },
            {
                id: 1009,
                status: 'unscheduled',
                coachingOfferingName: 'Goal Setting',
                startTime: '2025-07-18T10:00:00Z',
                endTime: '2025-07-18T11:00:00Z',
            },
            {
                id: 1010,
                status: 'requested',
                coachingOfferingName: 'Decision Making',
                startTime: '2025-07-21T14:00:00Z',
                endTime: '2025-07-21T15:00:00Z',
            },
            {
                id: 1011,
                status: 'completed',
                coachingOfferingName: 'Emotional Intelligence',
                startTime: '2025-07-23T13:00:00Z',
                endTime: '2025-07-23T14:00:00Z',
            },
            {
                id: 1012,
                status: 'accepted',
                coachingOfferingName: 'Performance Review Prep',
                startTime: '2025-07-25T11:00:00Z',
                endTime: '2025-07-25T12:00:00Z',
            },
            {
                id: 1013,
                status: 'completed',
                coachingOfferingName: 'Innovation Workshop',
                startTime: '2025-07-28T15:00:00Z',
                endTime: '2025-07-28T16:00:00Z',
            },
            {
                id: 1014,
                status: 'requested',
                coachingOfferingName: 'Work-Life Balance',
                startTime: '2025-07-30T10:00:00Z',
                endTime: '2025-07-30T11:00:00Z',
            },
            {
                id: 1015,
                status: 'unscheduled',
                coachingOfferingName: 'Executive Presence',
                startTime: '2025-07-31T14:00:00Z',
                endTime: '2025-07-31T15:00:00Z',
            },
        ],
        anonymousSessions: [
            {
                startTime: '2025-07-02T10:00:00Z',
                endTime: '2025-07-02T11:00:00Z',
            },
            {
                startTime: '2025-07-04T13:00:00Z',
                endTime: '2025-07-04T14:00:00Z',
            },
            {
                startTime: '2025-07-06T15:00:00Z',
                endTime: '2025-07-06T16:00:00Z',
            },
            {
                startTime: '2025-07-08T09:00:00Z',
                endTime: '2025-07-08T10:00:00Z',
            },
            {
                startTime: '2025-07-10T14:00:00Z',
                endTime: '2025-07-10T15:00:00Z',
            },
            {
                startTime: '2025-07-13T11:00:00Z',
                endTime: '2025-07-13T12:00:00Z',
            },
            {
                startTime: '2025-07-17T16:00:00Z',
                endTime: '2025-07-17T17:00:00Z',
            },
            {
                startTime: '2025-07-19T10:00:00Z',
                endTime: '2025-07-19T11:00:00Z',
            },
            {
                startTime: '2025-07-20T13:00:00Z',
                endTime: '2025-07-20T14:00:00Z',
            },
            {
                startTime: '2025-07-24T15:00:00Z',
                endTime: '2025-07-24T16:00:00Z',
            },
            {
                startTime: '2025-07-26T09:00:00Z',
                endTime: '2025-07-26T10:00:00Z',
            },
            {
                startTime: '2025-07-27T12:00:00Z',
                endTime: '2025-07-27T13:00:00Z',
            },
            {
                startTime: '2025-07-29T14:00:00Z',
                endTime: '2025-07-29T15:00:00Z',
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
