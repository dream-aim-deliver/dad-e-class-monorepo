import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveGroupNotesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveGroupNotesSuccessSchema = SaveGroupNotesSuccessResponseSchema.shape.data;
export type TSaveGroupNotesSuccess = z.infer<typeof SaveGroupNotesSuccessSchema>;

// Define view mode schemas
const SaveGroupNotesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveGroupNotesSuccessSchema
);

const SaveGroupNotesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveGroupNotesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveGroupNotesViewModelSchemaMap = {
    default: SaveGroupNotesDefaultViewModelSchema,
    kaboom: SaveGroupNotesKaboomViewModelSchema,
    notFound: SaveGroupNotesNotFoundViewModelSchema,
};
export type TSaveGroupNotesViewModelSchemaMap = typeof SaveGroupNotesViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveGroupNotesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveGroupNotesViewModelSchemaMap);
export type TSaveGroupNotesViewModel = z.infer<typeof SaveGroupNotesViewModelSchema>;
