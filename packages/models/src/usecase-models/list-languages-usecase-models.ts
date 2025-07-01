import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListLanguagesRequestSchema = DefaultPaginationSchema.extend({});
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
export type TListLanguagesUseCaseResponse = z.infer<typeof ListLanguagesUseCaseResponseSchema>;
