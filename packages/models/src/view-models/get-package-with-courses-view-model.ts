import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPackageWithCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPackageWithCoursesSuccessSchema = GetPackageWithCoursesSuccessResponseSchema.shape.data;
export type TGetPackageWithCoursesSuccess = z.infer<typeof GetPackageWithCoursesSuccessSchema>;

// Define view mode schemas
const GetPackageWithCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPackageWithCoursesSuccessSchema
);

const GetPackageWithCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPackageWithCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPackageWithCoursesViewModelSchemaMap = {
    default: GetPackageWithCoursesDefaultViewModelSchema,
    kaboom: GetPackageWithCoursesKaboomViewModelSchema,
    notFound: GetPackageWithCoursesNotFoundViewModelSchema,
};
export type TGetPackageWithCoursesViewModelSchemaMap = typeof GetPackageWithCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPackageWithCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPackageWithCoursesViewModelSchemaMap);
export type TGetPackageWithCoursesViewModel = z.infer<typeof GetPackageWithCoursesViewModelSchema>;
