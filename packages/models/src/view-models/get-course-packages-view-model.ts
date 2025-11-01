import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoursePackagesSuccessResponseSchema } from '../usecase-models/get-course-packages-usecase-models';

// Extract success data from usecase response
export const GetCoursePackagesSuccessSchema = GetCoursePackagesSuccessResponseSchema.shape.data;
export type TGetCoursePackagesSuccess = z.infer<typeof GetCoursePackagesSuccessSchema>;

// Define view mode schemas
const GetCoursePackagesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCoursePackagesSuccessSchema
);

const GetCoursePackagesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCoursePackagesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCoursePackagesViewModelSchemaMap = {
    default: GetCoursePackagesDefaultViewModelSchema,
    kaboom: GetCoursePackagesKaboomViewModelSchema,
    notFound: GetCoursePackagesNotFoundViewModelSchema,
};
export type TGetCoursePackagesViewModelSchemaMap = typeof GetCoursePackagesViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCoursePackagesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCoursePackagesViewModelSchemaMap);
export type TGetCoursePackagesViewModel = z.infer<typeof GetCoursePackagesViewModelSchema>;
