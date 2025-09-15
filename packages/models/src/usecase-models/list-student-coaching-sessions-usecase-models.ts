import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';
import { ScheduledCoachingSessionStatusSchema } from './common';

export const ListStudentCoachingSessionsRequestSchema = DefaultPaginationSchema.extend({
    studentId: z.number(),
});
export type TListStudentCoachingSessionsRequest = z.infer<typeof ListStudentCoachingSessionsRequestSchema>;

const CoachingSessionSchema = z.object({
    id: z.number(),
    coachingOfferingTitle: z.string(),
    coachingOfferingDuration: z.number(),  // minutes
    status: ScheduledCoachingSessionStatusSchema,
    startTime: z.string(),
    endTime: z.string(),
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


export const ListStudentCoachingSessionsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    sessions: CoachingSessionSchema.array(),
}));

export type TListStudentCoachingSessionsSuccessResponse = z.infer<typeof ListStudentCoachingSessionsSuccessResponseSchema>;

const ListStudentCoachingSessionsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListStudentCoachingSessionsUseCaseErrorResponse = z.infer<typeof ListStudentCoachingSessionsUseCaseErrorResponseSchema>;

export const ListStudentCoachingSessionsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListStudentCoachingSessionsSuccessResponseSchema,
    ListStudentCoachingSessionsUseCaseErrorResponseSchema,
]);

export type TListStudentCoachingSessionsUseCaseResponse = z.infer<typeof ListStudentCoachingSessionsUseCaseResponseSchema>;