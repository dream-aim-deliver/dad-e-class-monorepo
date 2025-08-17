import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { UploadCourseImageRequestSchema, UploadCourseImageSuccessResponseSchema } from './upload-course-image-usecase-models';

export const UploadLessonComponentFileRequestSchema = UploadCourseImageRequestSchema.extend({
  lessonId: z.number(),
  componentType: z.string(),
});

export type TUploadLessonComponentFileRequest = z.infer<typeof UploadLessonComponentFileRequestSchema>;

export const UploadLessonComponentFileSuccessResponseSchema = UploadCourseImageSuccessResponseSchema;

export type TUploadLessonComponentFileSuccessResponse = z.infer<typeof UploadLessonComponentFileSuccessResponseSchema>;

const UploadLessonComponentFileUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUploadLessonComponentFileUseCaseErrorResponse = z.infer<typeof UploadLessonComponentFileUseCaseErrorResponseSchema>;

export const UploadLessonComponentFileUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  UploadLessonComponentFileSuccessResponseSchema,
  UploadLessonComponentFileUseCaseErrorResponseSchema,
]);

export type TUploadLessonComponentFileUseCaseResponse = z.infer<typeof UploadLessonComponentFileUseCaseResponseSchema>;
