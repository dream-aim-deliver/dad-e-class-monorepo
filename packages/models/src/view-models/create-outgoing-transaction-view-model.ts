import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateOutgoingTransactionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateOutgoingTransactionSuccessSchema = CreateOutgoingTransactionSuccessResponseSchema.shape.data;
export type TCreateOutgoingTransactionSuccess = z.infer<typeof CreateOutgoingTransactionSuccessSchema>;

// Define view mode schemas
const CreateOutgoingTransactionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateOutgoingTransactionSuccessSchema
);

const CreateOutgoingTransactionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateOutgoingTransactionNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateOutgoingTransactionViewModelSchemaMap = {
    default: CreateOutgoingTransactionDefaultViewModelSchema,
    kaboom: CreateOutgoingTransactionKaboomViewModelSchema,
    notFound: CreateOutgoingTransactionNotFoundViewModelSchema,
};
export type TCreateOutgoingTransactionViewModelSchemaMap = typeof CreateOutgoingTransactionViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateOutgoingTransactionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateOutgoingTransactionViewModelSchemaMap);
export type TCreateOutgoingTransactionViewModel = z.infer<typeof CreateOutgoingTransactionViewModelSchema>;
