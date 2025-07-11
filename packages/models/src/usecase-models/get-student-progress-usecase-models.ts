import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetStudentProgressRequestSchema = z.object({
  courseSlug: z.string(),
});

export type TGetStudentProgressRequest = z.infer<typeof GetStudentProgressRequestSchema>;

export const GetStudentProgressSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  progressPercent: z.number().int().default(0),
  isCompleted: z.boolean()
}));

export type TGetStudentProgressSuccessResponse = z.infer<typeof GetStudentProgressSuccessResponseSchema>;

const GetStudentProgressUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetStudentProgressUseCaseErrorResponse = z.infer<typeof GetStudentProgressUseCaseErrorResponseSchema>;

export const GetStudentProgressUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetStudentProgressSuccessResponseSchema,
  GetStudentProgressUseCaseErrorResponseSchema,
]);

export type TGetStudentProgressUseCaseResponse = z.infer<typeof GetStudentProgressUseCaseResponseSchema>;
