import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveLessonComponentsSuccessResponseSchema } from '../usecase-models/save-lesson-components-usecase-models';

export const SaveLessonComponentsSuccessSchema = SaveLessonComponentsSuccessResponseSchema.shape.data;

export type TSaveLessonComponentsSuccess = z.infer<typeof SaveLessonComponentsSuccessSchema>;

const SaveLessonComponentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveLessonComponentsSuccessSchema);
const SaveLessonComponentInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(z.object({}), z.object({})));
const SaveLessonComponentConflictViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("conflict", BaseErrorDataSchemaFactory(z.object({
    courseVersion: z.number(),
}), z.object({})));
const SaveLessonComponentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(z.object({}), z.object({})));

export const SaveLessonComponentsViewModelSchemaMap = {
    default: SaveLessonComponentsDefaultViewModelSchema,
    kaboom: SaveLessonComponentsKaboomViewModelSchema,
    invalid: SaveLessonComponentInvalidViewModelSchema,
    conflict: SaveLessonComponentConflictViewModelSchema,
};
export type TSaveLessonComponentsViewModelSchemaMap = typeof SaveLessonComponentsViewModelSchemaMap;
export const SaveLessonComponentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveLessonComponentsViewModelSchemaMap);
export type TSaveLessonComponentsViewModel = z.infer<typeof SaveLessonComponentsViewModelSchema>;
