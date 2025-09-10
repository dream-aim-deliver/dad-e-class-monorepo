import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCourseStudentsSuccessResponseSchema } from '../usecase-models/list-course-students-usecase-models';

export const CourseStudentsListSuccessSchema = ListCourseStudentsSuccessResponseSchema.shape.data;

export type TCourseStudentsListSuccess = z.infer<typeof CourseStudentsListSuccessSchema>;

const CourseStudentsListDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseStudentsListSuccessSchema)
const CourseStudentsListKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))
const CourseStudentsListNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema))

export const CourseStudentsListViewModelSchemaMap = {
    default: CourseStudentsListDefaultViewModelSchema,
    kaboom: CourseStudentsListKaboomViewModelSchema,
    notFound: CourseStudentsListNotFoundViewModelSchema,
};
export type TCourseStudentsListViewModelSchemaMap = typeof CourseStudentsListViewModelSchemaMap;
export const CourseStudentsListViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseStudentsListViewModelSchemaMap);
export type TCourseStudentsListViewModel = z.infer<typeof CourseStudentsListViewModelSchema>;
