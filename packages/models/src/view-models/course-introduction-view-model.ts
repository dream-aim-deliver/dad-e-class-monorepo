import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseIntroductionSuccessResponseSchema } from '../usecase-models/get-course-introduction-usecase-models';

export const CourseIntroductionSuccessSchema = GetCourseIntroductionSuccessResponseSchema.shape.data;

export type TCourseIntroductionSuccess = z.infer<typeof CourseIntroductionSuccessSchema>;

const CourseIntroductionDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseIntroductionSuccessSchema);
const CourseIntroductionKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const CourseIntroductionViewModelSchemaMap = {
    default: CourseIntroductionDefaultViewModelSchema,
    kaboom: CourseIntroductionKaboomViewModelSchema,
};
export type TCourseIntroductionViewModelSchemaMap = typeof CourseIntroductionViewModelSchemaMap;
export const CourseIntroductionViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseIntroductionViewModelSchemaMap);
export type TCourseIntroductionViewModel = z.infer<typeof CourseIntroductionViewModelSchema>;
