import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTransactionTagsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListTransactionTagsSuccessSchema = ListTransactionTagsSuccessResponseSchema.shape.data;
export type TListTransactionTagsSuccess = z.infer<typeof ListTransactionTagsSuccessSchema>;

// Define view mode schemas
const ListTransactionTagsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListTransactionTagsSuccessSchema
);

const ListTransactionTagsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListTransactionTagsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListTransactionTagsViewModelSchemaMap = {
    default: ListTransactionTagsDefaultViewModelSchema,
    kaboom: ListTransactionTagsKaboomViewModelSchema,
    notFound: ListTransactionTagsNotFoundViewModelSchema,
};
export type TListTransactionTagsViewModelSchemaMap = typeof ListTransactionTagsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListTransactionTagsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListTransactionTagsViewModelSchemaMap);
export type TListTransactionTagsViewModel = z.infer<typeof ListTransactionTagsViewModelSchema>;
