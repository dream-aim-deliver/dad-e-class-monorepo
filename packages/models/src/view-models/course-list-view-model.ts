import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import {
    ListCoursesSuccessResponseSchema,
} from '@dream-aim-deliver/e-class-cms-rest';

export const CourseListSuccessSchema = ListCoursesSuccessResponseSchema.shape.data;

export type TCourseListSuccess = z.infer<typeof CourseListSuccessSchema>;

const CourseListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseListSuccessSchema)
const CourseListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const CourseListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CourseListViewModelSchemaMap = {
    default: CourseListDefaultViewModelSchema,
    kaboom: CourseListKaboomViewModelSchema,
    notFound: CourseListNotFoundViewModelSchema,
};
export type TCourseListViewModelSchemaMap = typeof CourseListViewModelSchemaMap;
export const CourseListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseListViewModelSchemaMap);
export type TCourseListViewModel = z.infer<typeof CourseListViewModelSchema>;
