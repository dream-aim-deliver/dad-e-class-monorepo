import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const VerifyFileRequestSchema = z.object({
  fileId: z.string(),
});

export type TVerifyFileRequest = z.infer<typeof VerifyFileRequestSchema>;

export const VerifyFileSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  downloadUrl: z.string(),
}));

export type TVerifyFileSuccessResponse = z.infer<typeof VerifyFileSuccessResponseSchema>;

const VerifyFileUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TVerifyFileUseCaseErrorResponse = z.infer<typeof VerifyFileUseCaseErrorResponseSchema>;

export const VerifyFileUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  VerifyFileSuccessResponseSchema,
  VerifyFileUseCaseErrorResponseSchema,
]);

export type TVerifyFileUseCaseResponse = z.infer<typeof VerifyFileUseCaseResponseSchema>;
