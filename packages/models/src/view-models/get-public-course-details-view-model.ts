import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPublicCourseDetailsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPublicCourseDetailsSuccessSchema = GetPublicCourseDetailsSuccessResponseSchema.shape.data;
export type TGetPublicCourseDetailsSuccess = z.infer<typeof GetPublicCourseDetailsSuccessSchema>;

// Define view mode schemas
const GetPublicCourseDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPublicCourseDetailsSuccessSchema
);

const GetPublicCourseDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPublicCourseDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPublicCourseDetailsViewModelSchemaMap = {
    default: GetPublicCourseDetailsDefaultViewModelSchema,
    kaboom: GetPublicCourseDetailsKaboomViewModelSchema,
    notFound: GetPublicCourseDetailsNotFoundViewModelSchema,
};
export type TGetPublicCourseDetailsViewModelSchemaMap = typeof GetPublicCourseDetailsViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPublicCourseDetailsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPublicCourseDetailsViewModelSchemaMap);
export type TGetPublicCourseDetailsViewModel = z.infer<typeof GetPublicCourseDetailsViewModelSchema>;
