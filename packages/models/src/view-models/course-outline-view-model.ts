import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseOutlineSuccessResponseSchema } from '../usecase-models/get-course-outline-usecase-models';

export const CourseOutlineSuccessSchema = GetCourseOutlineSuccessResponseSchema.shape.data;

export type TCourseOutlineSuccess = z.infer<typeof CourseOutlineSuccessSchema>;

const CourseOutlineDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseOutlineSuccessSchema);
const CourseOutlineKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const CourseOutlineViewModelSchemaMap = {
    default: CourseOutlineDefaultViewModelSchema,
    kaboom: CourseOutlineKaboomViewModelSchema,
};
export type TCourseOutlineViewModelSchemaMap = typeof CourseOutlineViewModelSchemaMap;
export const CourseOutlineViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseOutlineViewModelSchemaMap);
export type TCourseOutlineViewModel = z.infer<typeof CourseOutlineViewModelSchema>;
