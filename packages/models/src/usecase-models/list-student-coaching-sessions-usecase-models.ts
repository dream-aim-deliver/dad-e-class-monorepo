import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { StudentCoachingSessionSchema } from './common';

export const ListStudentCoachingSessionsRequestSchema = z.object({});
export type TListStudentCoachingSessionsRequest = z.infer<typeof ListStudentCoachingSessionsRequestSchema>;


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