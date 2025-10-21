import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUserOutgoingTransactionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUserOutgoingTransactionsSuccessSchema = ListUserOutgoingTransactionsSuccessResponseSchema.shape.data;
export type TListUserOutgoingTransactionsSuccess = z.infer<typeof ListUserOutgoingTransactionsSuccessSchema>;

// Define view mode schemas
const ListUserOutgoingTransactionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUserOutgoingTransactionsSuccessSchema
);

const ListUserOutgoingTransactionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUserOutgoingTransactionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUserOutgoingTransactionsViewModelSchemaMap = {
    default: ListUserOutgoingTransactionsDefaultViewModelSchema,
    kaboom: ListUserOutgoingTransactionsKaboomViewModelSchema,
    notFound: ListUserOutgoingTransactionsNotFoundViewModelSchema,
};
export type TListUserOutgoingTransactionsViewModelSchemaMap = typeof ListUserOutgoingTransactionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUserOutgoingTransactionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUserOutgoingTransactionsViewModelSchemaMap);
export type TListUserOutgoingTransactionsViewModel = z.infer<typeof ListUserOutgoingTransactionsViewModelSchema>;
