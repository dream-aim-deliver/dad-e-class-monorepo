import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const GetPlatformLanguageRequestSchema = z.object({});

export type TGetPlatformLanguageRequest = z.infer<typeof GetPlatformLanguageRequestSchema>;

export const GetPlatformLanguageSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
  impressumContent: z.string().nullable(),
  privacyPolicyContent: z.string().nullable(),
  termsOfUseContent: z.string().nullable(),
  aboutPageContent: z.string().nullable(),
  rules: z.string().nullable(),
  offerInformation: z.string().nullable(),
  enablePreCourseAssessment: z.boolean(),
}));

export type TGetPlatformLanguageSuccessResponse = z.infer<typeof GetPlatformLanguageSuccessResponseSchema>;

const GetPlatformLanguageUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetPlatformLanguageUseCaseErrorResponse = z.infer<typeof GetPlatformLanguageUseCaseErrorResponseSchema>;

export const GetPlatformLanguageUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  GetPlatformLanguageSuccessResponseSchema,
  GetPlatformLanguageUseCaseErrorResponseSchema,
]);

export type TGetPlatformLanguageUseCaseResponse = z.infer<typeof GetPlatformLanguageUseCaseResponseSchema>;
