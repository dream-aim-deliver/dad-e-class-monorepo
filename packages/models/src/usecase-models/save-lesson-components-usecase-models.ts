import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from './list-lesson-components-usecase-models';

export const SaveLessonComponentsRequestSchema = z.object({});

export type TSaveLessonComponentsRequest = z.infer<typeof SaveLessonComponentsRequestSchema>;

export const SaveLessonComponentsSuccessResponseSchema = ListLessonComponentsSuccessResponseSchema;

export type TSaveLessonComponentsSuccessResponse = z.infer<typeof SaveLessonComponentsSuccessResponseSchema>;

const SaveLessonComponentsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TSaveLessonComponentsUseCaseErrorResponse = z.infer<typeof SaveLessonComponentsUseCaseErrorResponseSchema>;

export const SaveLessonComponentsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  SaveLessonComponentsSuccessResponseSchema,
  SaveLessonComponentsUseCaseErrorResponseSchema,
]);

export type TSaveLessonComponentsUseCaseResponse = z.infer<typeof SaveLessonComponentsUseCaseResponseSchema>;
