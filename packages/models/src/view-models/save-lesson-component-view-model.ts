import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveLessonComponentsSuccessResponseSchema } from "@dream-aim-deliver/e-class-cms-rest";

export const SaveLessonComponentsSuccessSchema = SaveLessonComponentsSuccessResponseSchema.shape.data;

export type TSaveLessonComponentsSuccess = z.infer<typeof SaveLessonComponentsSuccessSchema>;

const SaveLessonComponentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", SaveLessonComponentsSuccessSchema);
const SaveLessonComponentInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const SaveLessonComponentConflictViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("conflict", BaseErrorDataSchemaFactory(BaseErrorDataSchema.extend({
    courseVersion: z.number(),
}), BaseErrorContextSchema));
const SaveLessonComponentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const SaveLessonComponentsViewModelSchemaMap = {
    default: SaveLessonComponentsDefaultViewModelSchema,
    kaboom: SaveLessonComponentsKaboomViewModelSchema,
    invalid: SaveLessonComponentInvalidViewModelSchema,
    conflict: SaveLessonComponentConflictViewModelSchema,
};
export type TSaveLessonComponentsViewModelSchemaMap = typeof SaveLessonComponentsViewModelSchemaMap;

export const SaveLessonComponentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveLessonComponentsViewModelSchemaMap);

export type TSaveLessonComponentsViewModel = z.infer<typeof SaveLessonComponentsViewModelSchema>;
