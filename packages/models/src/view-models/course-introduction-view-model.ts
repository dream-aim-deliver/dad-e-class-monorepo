import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseIntroductionSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

export const CourseIntroductionSuccessSchema = GetCourseIntroductionSuccessResponseSchema.shape.data;

export type TCourseIntroductionSuccess = z.infer<typeof CourseIntroductionSuccessSchema>;

const CourseIntroductionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseIntroductionSuccessSchema);
const CourseIntroductionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const CourseIntroductionViewModelSchemaMap = {
    default: CourseIntroductionDefaultViewModelSchema,
    kaboom: CourseIntroductionKaboomViewModelSchema,
};
export type TCourseIntroductionViewModelSchemaMap = typeof CourseIntroductionViewModelSchemaMap;
export const CourseIntroductionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseIntroductionViewModelSchemaMap);
export type TCourseIntroductionViewModel = z.infer<typeof CourseIntroductionViewModelSchema>;
