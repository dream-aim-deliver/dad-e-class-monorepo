import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseShortSuccessResponseSchema } from '../usecase-models/get-course-short-usecase-models';

export const CourseShortSuccessSchema = GetCourseShortSuccessResponseSchema.shape.data;

export type TCourseShortSuccess = z.infer<typeof CourseShortSuccessSchema>;

const CourseShortDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseShortSuccessSchema);
const CourseShortNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const CourseShortKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const CourseShortViewModelSchemaMap = {
    default: CourseShortDefaultViewModelSchema,
    notFound: CourseShortNotFoundViewModelSchema,
    kaboom: CourseShortKaboomViewModelSchema,
};
export type TCourseShortViewModelSchemaMap = typeof CourseShortViewModelSchemaMap;
export const CourseShortViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseShortViewModelSchemaMap);
export type TCourseShortViewModel = z.infer<typeof CourseShortViewModelSchema>;
