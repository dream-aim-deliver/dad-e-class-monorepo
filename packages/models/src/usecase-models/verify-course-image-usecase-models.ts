import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const VerifyCourseImageRequestSchema = z.object({
  fileId: z.string(),
});

export type TVerifyCourseImageRequest = z.infer<typeof VerifyCourseImageRequestSchema>;

export const VerifyCourseImageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  downloadUrl: z.string(),
}));

export type TVerifyCourseImageSuccessResponse = z.infer<typeof VerifyCourseImageSuccessResponseSchema>;

const VerifyCourseImageUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TVerifyCourseImageUseCaseErrorResponse = z.infer<typeof VerifyCourseImageUseCaseErrorResponseSchema>;

export const VerifyCourseImageUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  VerifyCourseImageSuccessResponseSchema,
  VerifyCourseImageUseCaseErrorResponseSchema,
]);

export type TVerifyCourseImageUseCaseResponse = z.infer<typeof VerifyCourseImageUseCaseResponseSchema>;
