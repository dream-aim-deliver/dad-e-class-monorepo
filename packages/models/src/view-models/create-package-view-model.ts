import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreatePackageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreatePackageSuccessSchema = CreatePackageSuccessResponseSchema.shape.data;
export type TCreatePackageSuccess = z.infer<typeof CreatePackageSuccessSchema>;

// Define view mode schemas
const CreatePackageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreatePackageSuccessSchema
);

const CreatePackageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreatePackageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreatePackageViewModelSchemaMap = {
    default: CreatePackageDefaultViewModelSchema,
    kaboom: CreatePackageKaboomViewModelSchema,
    notFound: CreatePackageNotFoundViewModelSchema,
};
export type TCreatePackageViewModelSchemaMap = typeof CreatePackageViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreatePackageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreatePackageViewModelSchemaMap);
export type TCreatePackageViewModel = z.infer<typeof CreatePackageViewModelSchema>;
