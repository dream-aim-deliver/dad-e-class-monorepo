import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseShortSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetCourseShortSuccessSchema = GetCourseShortSuccessResponseSchema.shape.data;
export type TGetCourseShortSuccess = z.infer<typeof GetCourseShortSuccessSchema>;

// Define view mode schemas
const GetCourseShortDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCourseShortSuccessSchema
);

const GetCourseShortKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCourseShortNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCourseShortViewModelSchemaMap = {
    default: GetCourseShortDefaultViewModelSchema,
    kaboom: GetCourseShortKaboomViewModelSchema,
    notFound: GetCourseShortNotFoundViewModelSchema,
};
export type TGetCourseShortViewModelSchemaMap = typeof GetCourseShortViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCourseShortViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCourseShortViewModelSchemaMap);
export type TGetCourseShortViewModel = z.infer<typeof GetCourseShortViewModelSchema>;
