import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CoachingSessionStatusSchema } from './common';

export const ListStudentCoachingSessionsRequestSchema = z.object({});
export type TListStudentCoachingSessionsRequest = z.infer<typeof ListStudentCoachingSessionsRequestSchema>;

const BaseCoachingSessionSchema = z.object({
    id: z.number(),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number(),  // minutes
    status: CoachingSessionStatusSchema,
});

export const AvailableCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('unscheduled'),
});
export type TAvailableCoachingSession = z.infer<typeof AvailableCoachingSessionSchema>;

export const RequestedCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('requested'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    coach: z.object({
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
export type TRequestedCoachingSession = z.infer<typeof RequestedCoachingSessionSchema>;

export const ScheduledCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('scheduled'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    coach: z.object({
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
export type TScheduledCoachingSession = z.infer<typeof ScheduledCoachingSessionSchema>;

// For backward compatibility, create a union type for upcoming sessions
export type TStudentUpcomingCoachingSession = TRequestedCoachingSession | TScheduledCoachingSession;

export const StudentEndedCoachingSessionSchema = BaseCoachingSessionSchema.extend({
    status: z.literal('completed'),
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    coach: z.object({
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
export type TStudentEndedCoachingSession = z.infer<typeof StudentEndedCoachingSessionSchema>;

export const StudentCoachingSessionSchema = z.discriminatedUnion(
    'status',
    [
        AvailableCoachingSessionSchema,
        RequestedCoachingSessionSchema,
        ScheduledCoachingSessionSchema,
        StudentEndedCoachingSessionSchema
    ]
)
export type TStudentCoachingSession = z.infer<typeof StudentCoachingSessionSchema>;


export const ListStudentCoachingSessionsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    sessions: StudentCoachingSessionSchema.array(),
}));

export type TListStudentCoachingSessionsSuccessResponse = z.infer<typeof ListStudentCoachingSessionsSuccessResponseSchema>;

const ListStudentCoachingSessionsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListStudentCoachingSessionsUseCaseErrorResponse = z.infer<typeof ListStudentCoachingSessionsUseCaseErrorResponseSchema>;

export const ListStudentCoachingSessionsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListStudentCoachingSessionsSuccessResponseSchema,
    ListStudentCoachingSessionsUseCaseErrorResponseSchema,
]);

export type TListStudentCoachingSessionsUseCaseResponse = z.infer<typeof ListStudentCoachingSessionsUseCaseResponseSchema>;