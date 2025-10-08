import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListLanguagesRequestSchema = DefaultPaginationSchema.extend({});
export type TListLanguagesRequest = z.infer<typeof ListLanguagesRequestSchema>;
import { ListLanguagesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

const ListLanguagesSuccessResponse = BaseSuccessSchemaFactory(ListLanguagesSuccessResponseSchema);

export type TListLanguagesSuccessResponse = z.infer<typeof ListLanguagesSuccessResponse>;

const ListLanguagesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListLanguagesUseCaseErrorResponse = z.infer<typeof ListLanguagesUseCaseErrorResponseSchema>;
export const ListLanguagesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListLanguagesSuccessResponseSchema,
    ListLanguagesUseCaseErrorResponseSchema,
]);
export type TListLanguagesUseCaseResponse = z.infer<typeof ListLanguagesUseCaseResponseSchema>;
