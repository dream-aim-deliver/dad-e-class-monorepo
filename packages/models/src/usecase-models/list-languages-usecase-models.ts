import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListLanguagesRequestSchema = z.object({});
export type TListLanguagesRequest = z.infer<typeof ListLanguagesRequestSchema>;

const ListLanguagesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    languages: z.array(z.object({
        languageCode: z.string(),
        language: z.string(),
    }))
}));

export type TListLanguagesSuccessResponse = z.infer<typeof ListLanguagesSuccessResponseSchema>;

const ListLanguagesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListLanguagesUseCaseErrorResponse = z.infer<typeof ListLanguagesUseCaseErrorResponseSchema>;
export const ListLanguagesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListLanguagesSuccessResponseSchema,
    ListLanguagesUseCaseErrorResponseSchema,
]);
export type TGetLanguagesUseCaseResponse = z.infer<typeof ListLanguagesUseCaseResponseSchema>;
