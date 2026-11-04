import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveGroupNoteTemplateSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveGroupNoteTemplateSuccessSchema = SaveGroupNoteTemplateSuccessResponseSchema.shape.data;
export type TSaveGroupNoteTemplateSuccess = z.infer<typeof SaveGroupNoteTemplateSuccessSchema>;

// Define view mode schemas
const SaveGroupNoteTemplateDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveGroupNoteTemplateSuccessSchema
);

const SaveGroupNoteTemplateKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveGroupNoteTemplateNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveGroupNoteTemplateViewModelSchemaMap = {
    default: SaveGroupNoteTemplateDefaultViewModelSchema,
    kaboom: SaveGroupNoteTemplateKaboomViewModelSchema,
    notFound: SaveGroupNoteTemplateNotFoundViewModelSchema,
};
export type TSaveGroupNoteTemplateViewModelSchemaMap = typeof SaveGroupNoteTemplateViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveGroupNoteTemplateViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveGroupNoteTemplateViewModelSchemaMap);
export type TSaveGroupNoteTemplateViewModel = z.infer<typeof SaveGroupNoteTemplateViewModelSchema>;
