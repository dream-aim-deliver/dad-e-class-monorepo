import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateTransactionTagSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateTransactionTagSuccessSchema = CreateTransactionTagSuccessResponseSchema.shape.data;
export type TCreateTransactionTagSuccess = z.infer<typeof CreateTransactionTagSuccessSchema>;

// Define view mode schemas
const CreateTransactionTagDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateTransactionTagSuccessSchema
);

const CreateTransactionTagKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateTransactionTagNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateTransactionTagViewModelSchemaMap = {
    default: CreateTransactionTagDefaultViewModelSchema,
    kaboom: CreateTransactionTagKaboomViewModelSchema,
    notFound: CreateTransactionTagNotFoundViewModelSchema,
};
export type TCreateTransactionTagViewModelSchemaMap = typeof CreateTransactionTagViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateTransactionTagViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateTransactionTagViewModelSchemaMap);
export type TCreateTransactionTagViewModel = z.infer<typeof CreateTransactionTagViewModelSchema>;
