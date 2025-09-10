import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { AddCourseCoachSuccessResponseSchema } from '../usecase-models/add-course-coach-usecase-models';
import { RemoveCourseCoachSuccessResponseSchema } from '../usecase-models/remove-course-coach-usecase-models';

// Add Coach View Model Schemas
export const AddCoachSuccessSchema = AddCourseCoachSuccessResponseSchema.shape.data;
export type TAddCoachSuccess = z.infer<typeof AddCoachSuccessSchema>;

const AddCoachSuccessViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("success", AddCoachSuccessSchema);
const AddCoachErrorViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("error", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const AddCoachKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const AddCoachViewModelSchemaMap = {
    success: AddCoachSuccessViewModelSchema,
    error: AddCoachErrorViewModelSchema,
    kaboom: AddCoachKaboomViewModelSchema,
};
export type TAddCoachViewModelSchemaMap = typeof AddCoachViewModelSchemaMap;
export const AddCoachViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AddCoachViewModelSchemaMap);
export type TAddCoachViewModel = z.infer<typeof AddCoachViewModelSchema>;

// Remove Coach View Model Schemas
export const RemoveCoachSuccessSchema = RemoveCourseCoachSuccessResponseSchema.shape.data;
export type TRemoveCoachSuccess = z.infer<typeof RemoveCoachSuccessSchema>;

const RemoveCoachSuccessViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("success", RemoveCoachSuccessSchema);
const RemoveCoachErrorViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("error", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const RemoveCoachKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const RemoveCoachViewModelSchemaMap = {
    success: RemoveCoachSuccessViewModelSchema,
    error: RemoveCoachErrorViewModelSchema,
    kaboom: RemoveCoachKaboomViewModelSchema,
};
export type TRemoveCoachViewModelSchemaMap = typeof RemoveCoachViewModelSchemaMap;
export const RemoveCoachViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RemoveCoachViewModelSchemaMap);
export type TRemoveCoachViewModel = z.infer<typeof RemoveCoachViewModelSchema>;
