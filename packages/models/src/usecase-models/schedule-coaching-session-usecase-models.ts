import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const ScheduleCoachingSessionRequestSchema = z.object({
    coachingSessionId: z.number(),
});
export type TScheduleCoachingSessionRequest = z.infer<typeof ScheduleCoachingSessionRequestSchema>;

const ScheduledCoachingSessionSchema = z.object({
    id: z.number(),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number(),  // minutes
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

export const ScheduleCoachingSessionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    coachingSession: ScheduledCoachingSessionSchema,
}));

export type TScheduleCoachingSessionSuccessResponse = z.infer<typeof ScheduleCoachingSessionSuccessResponseSchema>;

const ScheduleCoachingSessionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TScheduleCoachingSessionUseCaseErrorResponse = z.infer<typeof ScheduleCoachingSessionUseCaseErrorResponseSchema>;

export const ScheduleCoachingSessionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ScheduleCoachingSessionSuccessResponseSchema,
    ScheduleCoachingSessionUseCaseErrorResponseSchema,
]);

export type TScheduleCoachingSessionUseCaseResponse = z.infer<typeof ScheduleCoachingSessionUseCaseResponseSchema>;