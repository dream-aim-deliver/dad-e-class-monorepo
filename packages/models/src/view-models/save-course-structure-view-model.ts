import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveCourseStructureSuccessResponseSchema } from '../usecase-models/save-course-structure-usecase-models';

export const SaveCourseStructureSuccessSchema = SaveCourseStructureSuccessResponseSchema.shape.data;

export type TSaveCourseStructureSuccess = z.infer<typeof SaveCourseStructureSuccessSchema>;

const SaveCourseStructureDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveCourseStructureSuccessSchema);
const SaveCourseStructureInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const SaveCourseStructureConflictViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("conflict", BaseErrorDataSchemaFactory(BaseErrorDataSchema.extend({
    courseVersion: z.number(),
}), BaseErrorContextSchema));
const SaveCourseStructureKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const SaveCourseStructureViewModelSchemaMap = {
    default: SaveCourseStructureDefaultViewModelSchema,
    kaboom: SaveCourseStructureKaboomViewModelSchema,
    invalid: SaveCourseStructureInvalidViewModelSchema,
    conflict: SaveCourseStructureConflictViewModelSchema,
};
export type TSaveCourseStructureViewModelSchemaMap = typeof SaveCourseStructureViewModelSchemaMap;
export const SaveCourseStructureViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveCourseStructureViewModelSchemaMap);
export type TSaveCourseStructureViewModel = z.infer<typeof SaveCourseStructureViewModelSchema>;
