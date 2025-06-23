import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    GetCoursesSuccessResponseSchema,
    GetCoursesUseCaseResponseSchema
} from '../usecase-models/get-courses-usecase-models';

export const CourseListSuccessSchema = GetCoursesSuccessResponseSchema.shape.data;

export type TCourseListSuccess = z.infer<typeof CourseListSuccessSchema>;

const CourseListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseListSuccessSchema)
const CourseListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory())
const CourseListUnauthenticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory())
const CourseListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory())

export const CourseListViewModelSchemaMap = {
    default: CourseListDefaultViewModelSchema,
    kaboom: CourseListKaboomViewModelSchema,
    unauthenticated: CourseListUnauthenticatedViewModelSchema,
    notFound: CourseListNotFoundViewModelSchema,
};
export type TCourseListViewModelSchemaMap = typeof CourseListViewModelSchemaMap;
export const CourseListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseListViewModelSchemaMap);
export type TCourseListViewModel = z.infer<typeof CourseListViewModelSchema>;
