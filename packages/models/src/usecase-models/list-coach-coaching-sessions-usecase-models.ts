import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const ListCoachCoachingSessionsRequestSchema = z.object({});
export type TListCoachCoachingSessionsRequest = z.infer<typeof ListCoachCoachingSessionsRequestSchema>;

const BaseCoachingSessionSchema = z.object({
    id: z.number(),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number(), // minutes
});

// Split upcoming session into two schemas with literal discriminators so
// z.discriminatedUnion can correctly extract the `status` value.
export const UpcomingRequestedCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('requested'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    student: z.object({
        name: z.string().nullable(),
        surname: z.string().nullable(),
        username: z.string(),
        avatarUrl: z.string().nullable(),
    }),
    course: z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
    }).optional().nullable(),
    meetingUrl: z.string().nullable(),
});

export const UpcomingScheduledCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('scheduled'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    student: z.object({
        name: z.string().nullable(),
        surname: z.string().nullable(),
        username: z.string(),
        avatarUrl: z.string().nullable(),
    }),
    course: z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
    }).optional().nullable(),
    meetingUrl: z.string().nullable(),
});

export const CoachUpcomingCoachingSessionSchema = z.union([
    UpcomingRequestedCoachingSessionSchema,
    UpcomingScheduledCoachingSessionSchema,
]);
export type TCoachUpcomingCoachingSession = z.infer<typeof CoachUpcomingCoachingSessionSchema>;

export const CoachEndedCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('completed'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    student: z.object({
        name: z.string().nullable(),
        surname: z.string().nullable(),
        username: z.string(),
        avatarUrl: z.string().nullable(),
    }),
    course: z.object({
        id: z.number(),
        title: z.string(),
        slug: z.string(),
    }).optional().nullable(),
    review: z.object({
        rating: z.number().min(1).max(5),
        comment: z.string().optional().nullable(),
    }).optional().nullable(),
});
export type TCoachEndedCoachingSession = z.infer<typeof CoachEndedCoachingSessionSchema>;

export const CoachCoachingSessionSchema = z.discriminatedUnion('status', [
    UpcomingRequestedCoachingSessionSchema,
    UpcomingScheduledCoachingSessionSchema,
    CoachEndedCoachingSessionSchema,
]);
export type TCoachCoachingSession = z.infer<typeof CoachCoachingSessionSchema>;


export const ListCoachCoachingSessionsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    sessions: CoachCoachingSessionSchema.array(),
}));

export type TListCoachCoachingSessionsSuccessResponse = z.infer<typeof ListCoachCoachingSessionsSuccessResponseSchema>;

const ListCoachCoachingSessionsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCoachCoachingSessionsUseCaseErrorResponse = z.infer<typeof ListCoachCoachingSessionsUseCaseErrorResponseSchema>;

export const ListCoachCoachingSessionsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCoachCoachingSessionsSuccessResponseSchema,
    ListCoachCoachingSessionsUseCaseErrorResponseSchema,
]);

export type TListCoachCoachingSessionsUseCaseResponse = z.infer<typeof ListCoachCoachingSessionsUseCaseResponseSchema>;