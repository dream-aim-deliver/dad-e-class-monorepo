import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCourseStructureSuccessResponseSchema } from '../usecase-models/get-course-structure-usecase-models';

export const CourseStructureSuccessSchema = GetCourseStructureSuccessResponseSchema.shape.data;

export type TCourseStructureSuccess = z.infer<typeof CourseStructureSuccessSchema>;

const CourseStructureDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", CourseStructureSuccessSchema);
const CourseStructureKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const CourseStructureViewModelSchemaMap = {
    default: CourseStructureDefaultViewModelSchema,
    kaboom: CourseStructureKaboomViewModelSchema,
};
export type TCourseStructureViewModelSchemaMap = typeof CourseStructureViewModelSchemaMap;
export const CourseStructureViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CourseStructureViewModelSchemaMap);
export type TCourseStructureViewModel = z.infer<typeof CourseStructureViewModelSchema>;
