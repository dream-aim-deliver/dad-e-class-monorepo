import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUserIncomingTransactionsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUserIncomingTransactionsSuccessSchema = ListUserIncomingTransactionsSuccessResponseSchema.shape.data;
export type TListUserIncomingTransactionsSuccess = z.infer<typeof ListUserIncomingTransactionsSuccessSchema>;

// Define view mode schemas
const ListUserIncomingTransactionsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUserIncomingTransactionsSuccessSchema
);

const ListUserIncomingTransactionsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUserIncomingTransactionsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUserIncomingTransactionsViewModelSchemaMap = {
    default: ListUserIncomingTransactionsDefaultViewModelSchema,
    kaboom: ListUserIncomingTransactionsKaboomViewModelSchema,
    notFound: ListUserIncomingTransactionsNotFoundViewModelSchema,
};
export type TListUserIncomingTransactionsViewModelSchemaMap = typeof ListUserIncomingTransactionsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUserIncomingTransactionsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUserIncomingTransactionsViewModelSchemaMap);
export type TListUserIncomingTransactionsViewModel = z.infer<typeof ListUserIncomingTransactionsViewModelSchema>;
