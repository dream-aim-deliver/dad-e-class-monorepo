import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveLessonComponentsSuccessResponseSchema } from '../usecase-models/save-lesson-components-usecase-models';

// TODO: Redefine the success response schema as needed
export const SaveLessonComponentsSuccessSchema = SaveLessonComponentsSuccessResponseSchema.shape.data;

export type TSaveLessonComponentsSuccess = z.infer<typeof SaveLessonComponentsSuccessSchema>;

// TODO: Define other error schemas as needed
const SaveLessonComponentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveLessonComponentsSuccessSchema);
const SaveLessonComponentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory());

export const SaveLessonComponentsViewModelSchemaMap = {
    default: SaveLessonComponentsDefaultViewModelSchema,
    kaboom: SaveLessonComponentsKaboomViewModelSchema,
};
export type TSaveLessonComponentsViewModelSchemaMap = typeof SaveLessonComponentsViewModelSchemaMap;
export const SaveLessonComponentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveLessonComponentsViewModelSchemaMap);
export type TSaveLessonComponentsViewModel = z.infer<typeof SaveLessonComponentsViewModelSchema>;
