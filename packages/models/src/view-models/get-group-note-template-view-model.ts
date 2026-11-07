import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetGroupNoteTemplateSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetGroupNoteTemplateSuccessSchema = GetGroupNoteTemplateSuccessResponseSchema.shape.data;
export type TGetGroupNoteTemplateSuccess = z.infer<typeof GetGroupNoteTemplateSuccessSchema>;

// Define view mode schemas
const GetGroupNoteTemplateDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetGroupNoteTemplateSuccessSchema
);

const GetGroupNoteTemplateKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetGroupNoteTemplateNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetGroupNoteTemplateViewModelSchemaMap = {
    default: GetGroupNoteTemplateDefaultViewModelSchema,
    kaboom: GetGroupNoteTemplateKaboomViewModelSchema,
    notFound: GetGroupNoteTemplateNotFoundViewModelSchema,
};
export type TGetGroupNoteTemplateViewModelSchemaMap = typeof GetGroupNoteTemplateViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetGroupNoteTemplateViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetGroupNoteTemplateViewModelSchemaMap);
export type TGetGroupNoteTemplateViewModel = z.infer<typeof GetGroupNoteTemplateViewModelSchema>;
