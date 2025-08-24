import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { UploadCourseImageSuccessResponseSchema } from './upload-course-image-usecase-models';

export const UploadIntroductionVideoRequestSchema = z.object({
  courseSlug: z.string(),
  name: z.string(),
  checksum: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

export type TUploadIntroductionVideoRequest = z.infer<typeof UploadIntroductionVideoRequestSchema>;

export const UploadIntroductionVideoSuccessResponseSchema = UploadCourseImageSuccessResponseSchema;

export type TUploadIntroductionVideoSuccessResponse = z.infer<typeof UploadIntroductionVideoSuccessResponseSchema>;

const UploadIntroductionVideoUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUploadIntroductionVideoUseCaseErrorResponse = z.infer<typeof UploadIntroductionVideoUseCaseErrorResponseSchema>;

export const UploadIntroductionVideoUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  UploadIntroductionVideoSuccessResponseSchema,
  UploadIntroductionVideoUseCaseErrorResponseSchema,
]);

export type TUploadIntroductionVideoUseCaseResponse = z.infer<typeof UploadIntroductionVideoUseCaseResponseSchema>;