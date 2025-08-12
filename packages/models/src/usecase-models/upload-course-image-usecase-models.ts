import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const UploadCourseImageRequestSchema = z.object({
  name: z.string(),
  checksum: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

export type TUploadCourseImageRequest = z.infer<typeof UploadCourseImageRequestSchema>;

export const UploadCourseImageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  storageUrl: z.string(),
  formFields: z.record(z.string()),
  file: z.object({
    id: z.string(),
    name: z.string(),
    size: z.number(),
    category: z.string(),
    objectName: z.string(),
  })
}));

export type TUploadCourseImageSuccessResponse = z.infer<typeof UploadCourseImageSuccessResponseSchema>;

const UploadCourseImageUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUploadCourseImageUseCaseErrorResponse = z.infer<typeof UploadCourseImageUseCaseErrorResponseSchema>;

export const UploadCourseImageUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  UploadCourseImageSuccessResponseSchema,
  UploadCourseImageUseCaseErrorResponseSchema,
]);

export type TUploadCourseImageUseCaseResponse = z.infer<typeof UploadCourseImageUseCaseResponseSchema>;
