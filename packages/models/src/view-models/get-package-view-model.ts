import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPackageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPackageSuccessSchema = GetPackageSuccessResponseSchema.shape.data;
export type TGetPackageSuccess = z.infer<typeof GetPackageSuccessSchema>;

// Define view mode schemas
const GetPackageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPackageSuccessSchema
);

const GetPackageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPackageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPackageViewModelSchemaMap = {
    default: GetPackageDefaultViewModelSchema,
    kaboom: GetPackageKaboomViewModelSchema,
    notFound: GetPackageNotFoundViewModelSchema,
};
export type TGetPackageViewModelSchemaMap = typeof GetPackageViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPackageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPackageViewModelSchemaMap);
export type TGetPackageViewModel = z.infer<typeof GetPackageViewModelSchema>;
