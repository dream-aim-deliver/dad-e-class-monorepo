import { z } from 'zod';
import {
  BaseDiscriminatedErrorTypeSchemaFactory,
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from './list-lesson-components-usecase-models';
import { LessonComponentRequestSchema } from './common';

export const SaveLessonComponentsRequestSchema = z.object({
  lessonId: z.number(),
  courseVersion: z.number(),
  components: z.array(LessonComponentRequestSchema)
});

export type TSaveLessonComponentsRequest = z.infer<typeof SaveLessonComponentsRequestSchema>;

export const SaveLessonComponentsSuccessResponseSchema = ListLessonComponentsSuccessResponseSchema;

export type TSaveLessonComponentsSuccessResponse = z.infer<typeof SaveLessonComponentsSuccessResponseSchema>;

const SaveLessonComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  ConflictError: BaseDiscriminatedErrorTypeSchemaFactory({
    type: 'ConflictError',
    schema: z.object({
      trace: z.string().optional(),
      courseVersion: z.number(),
    }),
  }),
});
export type TSaveLessonComponentsUseCaseErrorResponse = z.infer<typeof SaveLessonComponentsUseCaseErrorResponseSchema>;

export const SaveLessonComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveLessonComponentsSuccessResponseSchema,
  SaveLessonComponentsUseCaseErrorResponseSchema,
]);

export type TSaveLessonComponentsUseCaseResponse = z.infer<typeof SaveLessonComponentsUseCaseResponseSchema>;
