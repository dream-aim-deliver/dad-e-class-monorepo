import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListTransactionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListTransactionsSuccessSchema = ListTransactionsSuccessResponseSchema.shape.data;
export type TListTransactionsSuccess = z.infer<typeof ListTransactionsSuccessSchema>;

// Define view mode schemas
const ListTransactionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListTransactionsSuccessSchema
);

const ListTransactionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListTransactionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListTransactionsViewModelSchemaMap = {
    default: ListTransactionsDefaultViewModelSchema,
    kaboom: ListTransactionsKaboomViewModelSchema,
    notFound: ListTransactionsNotFoundViewModelSchema,
};
export type TListTransactionsViewModelSchemaMap = typeof ListTransactionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListTransactionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListTransactionsViewModelSchemaMap);
export type TListTransactionsViewModel = z.infer<typeof ListTransactionsViewModelSchema>;
