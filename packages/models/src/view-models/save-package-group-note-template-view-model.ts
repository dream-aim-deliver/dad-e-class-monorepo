import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SavePackageGroupNoteTemplateSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SavePackageGroupNoteTemplateSuccessSchema = SavePackageGroupNoteTemplateSuccessResponseSchema.shape.data;
export type TSavePackageGroupNoteTemplateSuccess = z.infer<typeof SavePackageGroupNoteTemplateSuccessSchema>;

// Define view mode schemas
const SavePackageGroupNoteTemplateDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SavePackageGroupNoteTemplateSuccessSchema
);

const SavePackageGroupNoteTemplateKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SavePackageGroupNoteTemplateNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SavePackageGroupNoteTemplateViewModelSchemaMap = {
    default: SavePackageGroupNoteTemplateDefaultViewModelSchema,
    kaboom: SavePackageGroupNoteTemplateKaboomViewModelSchema,
    notFound: SavePackageGroupNoteTemplateNotFoundViewModelSchema,
};
export type TSavePackageGroupNoteTemplateViewModelSchemaMap = typeof SavePackageGroupNoteTemplateViewModelSchemaMap;

// Create discriminated union of all view modes
export const SavePackageGroupNoteTemplateViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SavePackageGroupNoteTemplateViewModelSchemaMap);
export type TSavePackageGroupNoteTemplateViewModel = z.infer<typeof SavePackageGroupNoteTemplateViewModelSchema>;
