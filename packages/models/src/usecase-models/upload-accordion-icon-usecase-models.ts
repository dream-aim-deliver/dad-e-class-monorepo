import { z } from 'zod';
import {
  BaseErrorDiscriminatedUnionSchemaFactory,
  BaseStatusDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { UploadCourseImageSuccessResponseSchema } from './upload-course-image-usecase-models';

export const UploadAccordionIconRequestSchema = z.object({
  courseSlug: z.string(),
  name: z.string(),
  checksum: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

export type TUploadAccordionIconRequest = z.infer<typeof UploadAccordionIconRequestSchema>;

export const UploadAccordionIconSuccessResponseSchema = UploadCourseImageSuccessResponseSchema;

export type TUploadAccordionIconSuccessResponse = z.infer<typeof UploadAccordionIconSuccessResponseSchema>;

const UploadAccordionIconUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TUploadAccordionIconUseCaseErrorResponse = z.infer<typeof UploadAccordionIconUseCaseErrorResponseSchema>;

export const UploadAccordionIconUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  UploadAccordionIconSuccessResponseSchema,
  UploadAccordionIconUseCaseErrorResponseSchema,
]);

export type TUploadAccordionIconUseCaseResponse = z.infer<typeof UploadAccordionIconUseCaseResponseSchema>;
