import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListUpcomingStudentCoachingSessionsRequestSchema = DefaultPaginationSchema.extend({
    studentId: z.number(),
});
export type TListUpcomingStudentCoachingSessionsRequest = z.infer<typeof ListUpcomingStudentCoachingSessionsRequestSchema>;

const CoachingSessionSchema = z.object({
    id: z.number(),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number(),  // minutes
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

export type TUpcomingStudentCoachingSession = z.infer<typeof CoachingSessionSchema>;


export const ListUpcomingStudentCoachingSessionsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    sessions: CoachingSessionSchema.array(),
}));

export type TListUpcomingStudentCoachingSessionsSuccessResponse = z.infer<typeof ListUpcomingStudentCoachingSessionsSuccessResponseSchema>;

const ListUpcomingStudentCoachingSessionsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListUpcomingStudentCoachingSessionsUseCaseErrorResponse = z.infer<typeof ListUpcomingStudentCoachingSessionsUseCaseErrorResponseSchema>;

export const ListUpcomingStudentCoachingSessionsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListUpcomingStudentCoachingSessionsSuccessResponseSchema,
    ListUpcomingStudentCoachingSessionsUseCaseErrorResponseSchema,
]);

export type TListUpcomingStudentCoachingSessionsUseCaseResponse = z.infer<typeof ListUpcomingStudentCoachingSessionsUseCaseResponseSchema>;