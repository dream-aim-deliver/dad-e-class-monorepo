import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { LessonComponentSchema } from './common';

export const ListLessonComponentsRequestSchema = z.object({
  lessonId: z.number(),
  withProgress: z.boolean().optional(),
});

export type TListLessonComponentsRequest = z.infer<typeof ListLessonComponentsRequestSchema>;

export const ListLessonComponentsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  courseVersion: z.number(),
  components: z.array(LessonComponentSchema),
  lessonTitle: z.string(),
}));

export type TListLessonComponentsSuccessResponse = z.infer<typeof ListLessonComponentsSuccessResponseSchema>;

const ListLessonComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListLessonComponentsUseCaseErrorResponse = z.infer<typeof ListLessonComponentsUseCaseErrorResponseSchema>;

export const ListLessonComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  ListLessonComponentsSuccessResponseSchema,
  ListLessonComponentsUseCaseErrorResponseSchema,
]);

export type TListLessonComponentsUseCaseResponse = z.infer<typeof ListLessonComponentsUseCaseResponseSchema>;
