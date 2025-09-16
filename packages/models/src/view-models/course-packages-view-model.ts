import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { GetCoursePackagesSuccessResponseSchema } from '../usecase-models/get-course-packages-usecase-models';

export const CoursePackagesSuccessSchema =
    GetCoursePackagesSuccessResponseSchema.shape.data;

export type TCoursePackagesSuccess = z.infer<
    typeof CoursePackagesSuccessSchema
>;

const CoursePackagesDefaultViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'default',
        CoursePackagesSuccessSchema,
    );
const CoursePackagesKaboomViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'kaboom',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );
const CoursePackagesNotFoundViewModelSchema =
    BaseDiscriminatedViewModeSchemaFactory(
        'not-found',
        BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema),
    );

export const CoursePackagesViewModelSchemaMap = {
    default: CoursePackagesDefaultViewModelSchema,
    kaboom: CoursePackagesKaboomViewModelSchema,
    notFound: CoursePackagesNotFoundViewModelSchema,
};
export type TCoursePackagesViewModelSchemaMap =
    typeof CoursePackagesViewModelSchemaMap;
export const CoursePackagesViewModelSchema =
    BaseViewModelDiscriminatedUnionSchemaFactory(
        CoursePackagesViewModelSchemaMap,
    );
export type TCoursePackagesViewModel = z.infer<
    typeof CoursePackagesViewModelSchema
>;
