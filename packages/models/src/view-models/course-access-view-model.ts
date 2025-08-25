import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CourseRoleSchema, GetCourseAccessSuccessResponseSchema } from '../usecase-models/get-course-access-usecase-models';

export const CourseAccessSuccessSchema = GetCourseAccessSuccessResponseSchema.shape.data.extend({
    highestRole: CourseRoleSchema.nullable(),
});

export type TCourseAccessSuccess = z.infer<typeof CourseAccessSuccessSchema>;

const CourseAccessDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseAccessSuccessSchema);
const CourseAccessKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const CourseAccessNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const CourseAccessUnautheticatedViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("unauthenticated", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const CourseAccessViewModelSchemaMap = {
    default: CourseAccessDefaultViewModelSchema,
    kaboom: CourseAccessKaboomViewModelSchema,
    notFound: CourseAccessNotFoundViewModelSchema,
    unauthenticated: CourseAccessUnautheticatedViewModelSchema,
};
export type TCourseAccessViewModelSchemaMap = typeof CourseAccessViewModelSchemaMap;
export const CourseAccessViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseAccessViewModelSchemaMap);
export type TCourseAccessViewModel = z.infer<typeof CourseAccessViewModelSchema>;
