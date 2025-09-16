import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    ListCourseReviewsSuccessResponseSchema,
} from '../usecase-models/list-course-reviews-usecase-models';

export const CourseReviewsSuccessSchema = ListCourseReviewsSuccessResponseSchema.shape.data;

export type TCourseReviewsSuccess = z.infer<typeof CourseReviewsSuccessSchema>;

const CourseReviewsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseReviewsSuccessSchema)
const CourseReviewsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CourseReviewsViewModelSchemaMap = {
    default: CourseReviewsDefaultViewModelSchema,
    kaboom: CourseReviewsKaboomViewModelSchema,
};
export type TCourseReviewsViewModelSchemaMap = typeof CourseReviewsViewModelSchemaMap;
export const CourseReviewsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseReviewsViewModelSchemaMap);
export type TCourseReviewsViewModel = z.infer<typeof CourseReviewsViewModelSchema>;
