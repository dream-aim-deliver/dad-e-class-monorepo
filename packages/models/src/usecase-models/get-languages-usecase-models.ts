import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetLanguagesRequestSchema = z.object({});
export type TGetLanguagesRequest = z.infer<typeof GetLanguagesRequestSchema>;

const GetLanguagesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    languages: z.array(z.object({
        languageCode: z.string(),
        language: z.string(),
    }))
}));

export type TGetLanguagesSuccessResponse = z.infer<typeof GetLanguagesSuccessResponseSchema>;

const GetLanguagesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetLanguagesUseCaseErrorResponse = z.infer<typeof GetLanguagesUseCaseErrorResponseSchema>;
export const GetLanguagesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetLanguagesSuccessResponseSchema,
    GetLanguagesUseCaseErrorResponseSchema,
]);
export type TGetLanguagesUseCaseResponse = z.infer<typeof GetLanguagesUseCaseResponseSchema>;
