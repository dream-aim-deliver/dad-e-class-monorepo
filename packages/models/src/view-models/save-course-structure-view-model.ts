import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveCourseStructureSuccessResponseSchema } from '../usecase-models/save-course-structure-usecase-models';

export const SaveCourseStructureSuccessSchema = SaveCourseStructureSuccessResponseSchema.shape.data;

export type TSaveCourseStructureSuccess = z.infer<typeof SaveCourseStructureSuccessSchema>;

const SaveCourseStructureDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveCourseStructureSuccessSchema);
const SaveCourseStructureInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const SaveCourseStructureConflictViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("conflict", BaseErrorDataSchemaFactory(z.object({
    courseVersion: z.number(),
}), z.object({})));
const SaveCourseStructureKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const SaveCourseStructureViewModelSchemaMap = {
    default: SaveCourseStructureDefaultViewModelSchema,
    kaboom: SaveCourseStructureKaboomViewModelSchema,
    invalid: SaveCourseStructureInvalidViewModelSchema,
    conflict: SaveCourseStructureConflictViewModelSchema,
};
export type TSaveCourseStructureViewModelSchemaMap = typeof SaveCourseStructureViewModelSchemaMap;
export const SaveCourseStructureViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveCourseStructureViewModelSchemaMap);
export type TSaveCourseStructureViewModel = z.infer<typeof SaveCourseStructureViewModelSchema>;
