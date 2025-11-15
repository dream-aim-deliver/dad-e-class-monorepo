import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetStudentCourseReviewSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetStudentCourseReviewSuccessSchema = GetStudentCourseReviewSuccessResponseSchema.shape.data;
export type TGetStudentCourseReviewSuccess = z.infer<typeof GetStudentCourseReviewSuccessSchema>;

// Define view mode schemas
const GetStudentCourseReviewDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetStudentCourseReviewSuccessSchema
);

const GetStudentCourseReviewKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetStudentCourseReviewNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetStudentCourseReviewViewModelSchemaMap = {
    default: GetStudentCourseReviewDefaultViewModelSchema,
    kaboom: GetStudentCourseReviewKaboomViewModelSchema,
    notFound: GetStudentCourseReviewNotFoundViewModelSchema,
};
export type TGetStudentCourseReviewViewModelSchemaMap = typeof GetStudentCourseReviewViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetStudentCourseReviewViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetStudentCourseReviewViewModelSchemaMap);
export type TGetStudentCourseReviewViewModel = z.infer<typeof GetStudentCourseReviewViewModelSchema>;
