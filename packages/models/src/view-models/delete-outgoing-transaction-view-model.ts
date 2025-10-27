import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DeleteOutgoingTransactionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const DeleteOutgoingTransactionSuccessSchema = DeleteOutgoingTransactionSuccessResponseSchema.shape.data;
export type TDeleteOutgoingTransactionSuccess = z.infer<typeof DeleteOutgoingTransactionSuccessSchema>;

// Define view mode schemas
const DeleteOutgoingTransactionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    DeleteOutgoingTransactionSuccessSchema
);

const DeleteOutgoingTransactionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const DeleteOutgoingTransactionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const DeleteOutgoingTransactionViewModelSchemaMap = {
    default: DeleteOutgoingTransactionDefaultViewModelSchema,
    kaboom: DeleteOutgoingTransactionKaboomViewModelSchema,
    notFound: DeleteOutgoingTransactionNotFoundViewModelSchema,
};
export type TDeleteOutgoingTransactionViewModelSchemaMap = typeof DeleteOutgoingTransactionViewModelSchemaMap;

// Create discriminated union of all view modes
export const DeleteOutgoingTransactionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DeleteOutgoingTransactionViewModelSchemaMap);
export type TDeleteOutgoingTransactionViewModel = z.infer<typeof DeleteOutgoingTransactionViewModelSchema>;
