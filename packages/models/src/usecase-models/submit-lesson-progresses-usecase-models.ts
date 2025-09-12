import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { LessonProgressSchema } from './common';

export const SubmitLessonProgressesRequestSchema = z.object({
  lessonId: z.number(),
  progress: LessonProgressSchema.array(),
});

export type TSubmitLessonProgressesRequest = z.infer<typeof SubmitLessonProgressesRequestSchema>;

export const SubmitLessonProgressesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TSubmitLessonProgressesSuccessResponse = z.infer<typeof SubmitLessonProgressesSuccessResponseSchema>;

const SubmitLessonProgressesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSubmitLessonProgressesUseCaseErrorResponse = z.infer<typeof SubmitLessonProgressesUseCaseErrorResponseSchema>;

export const SubmitLessonProgressesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SubmitLessonProgressesSuccessResponseSchema,
  SubmitLessonProgressesUseCaseErrorResponseSchema,
]);

export type TSubmitLessonProgressesUseCaseResponse = z.infer<typeof SubmitLessonProgressesUseCaseResponseSchema>;
