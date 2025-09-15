import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { UploadCourseImageRequestSchema, UploadCourseImageSuccessResponseSchema } from './upload-course-image-usecase-models';

export const UploadLessonProgressFileRequestSchema = UploadCourseImageRequestSchema.extend({
  lessonId: z.number(),
  componentId: z.string(),
});

export type TUploadLessonProgressFileRequest = z.infer<typeof UploadLessonProgressFileRequestSchema>;

export const UploadLessonProgressFileSuccessResponseSchema = UploadCourseImageSuccessResponseSchema;

export type TUploadLessonProgressFileSuccessResponse = z.infer<typeof UploadLessonProgressFileSuccessResponseSchema>;

const UploadLessonProgressFileUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUploadLessonProgressFileUseCaseErrorResponse = z.infer<typeof UploadLessonProgressFileUseCaseErrorResponseSchema>;

export const UploadLessonProgressFileUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  UploadLessonProgressFileSuccessResponseSchema,
  UploadLessonProgressFileUseCaseErrorResponseSchema,
]);

export type TUploadLessonProgressFileUseCaseResponse = z.infer<typeof UploadLessonProgressFileUseCaseResponseSchema>;
