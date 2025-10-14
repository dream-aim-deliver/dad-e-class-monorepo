import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdatePackageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const UpdatePackageSuccessSchema = UpdatePackageSuccessResponseSchema.shape.data;
export type TUpdatePackageSuccess = z.infer<typeof UpdatePackageSuccessSchema>;

// Define view mode schemas
const UpdatePackageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    UpdatePackageSuccessSchema
);

const UpdatePackageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const UpdatePackageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const UpdatePackageViewModelSchemaMap = {
    default: UpdatePackageDefaultViewModelSchema,
    kaboom: UpdatePackageKaboomViewModelSchema,
    notFound: UpdatePackageNotFoundViewModelSchema,
};
export type TUpdatePackageViewModelSchemaMap = typeof UpdatePackageViewModelSchemaMap;

// Create discriminated union of all view modes
export const UpdatePackageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdatePackageViewModelSchemaMap);
export type TUpdatePackageViewModel = z.infer<typeof UpdatePackageViewModelSchema>;
