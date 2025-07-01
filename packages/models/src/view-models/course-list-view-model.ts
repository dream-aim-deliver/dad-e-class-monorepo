import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    ListCoursesSuccessResponseSchema,
} from '../usecase-models/list-courses-usecase-models';

export const CourseListSuccessSchema = ListCoursesSuccessResponseSchema.shape.data;

export type TCourseListSuccess = z.infer<typeof CourseListSuccessSchema>;

const CourseListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseListSuccessSchema)
const CourseListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const CourseListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory())

export const CourseListViewModelSchemaMap = {
    default: CourseListDefaultViewModelSchema,
    kaboom: CourseListKaboomViewModelSchema,
    notFound: CourseListNotFoundViewModelSchema,
};
export type TCourseListViewModelSchemaMap = typeof CourseListViewModelSchemaMap;
export const CourseListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseListViewModelSchemaMap);
export type TCourseListViewModel = z.infer<typeof CourseListViewModelSchema>;
