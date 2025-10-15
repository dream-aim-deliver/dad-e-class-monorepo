import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
  BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { StudentCoachingSessionSchema } from './common';

export const GetStudentCoachingSessionRequestSchema = z.object({});

export type TGetStudentCoachingSessionRequest = z.infer<typeof GetStudentCoachingSessionRequestSchema>;

export const GetStudentCoachingSessionSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  session: StudentCoachingSessionSchema,
}));

export type TGetStudentCoachingSessionSuccessResponse = z.infer<typeof GetStudentCoachingSessionSuccessResponseSchema>;

const GetStudentCoachingSessionUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetStudentCoachingSessionUseCaseErrorResponse = z.infer<typeof GetStudentCoachingSessionUseCaseErrorResponseSchema>;

export const GetStudentCoachingSessionUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetStudentCoachingSessionSuccessResponseSchema,
  GetStudentCoachingSessionUseCaseErrorResponseSchema,
]);

export type TGetStudentCoachingSessionUseCaseResponse = z.infer<typeof GetStudentCoachingSessionUseCaseResponseSchema>;
