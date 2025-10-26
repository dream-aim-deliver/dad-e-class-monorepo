import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SavePlatformLanguageLegalTextsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SavePlatformLanguageLegalTextsSuccessSchema = SavePlatformLanguageLegalTextsSuccessResponseSchema.shape.data;
export type TSavePlatformLanguageLegalTextsSuccess = z.infer<typeof SavePlatformLanguageLegalTextsSuccessSchema>;

// Define view mode schemas
const SavePlatformLanguageLegalTextsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SavePlatformLanguageLegalTextsSuccessSchema
);

const SavePlatformLanguageLegalTextsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SavePlatformLanguageLegalTextsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SavePlatformLanguageLegalTextsViewModelSchemaMap = {
    default: SavePlatformLanguageLegalTextsDefaultViewModelSchema,
    kaboom: SavePlatformLanguageLegalTextsKaboomViewModelSchema,
    notFound: SavePlatformLanguageLegalTextsNotFoundViewModelSchema,
};
export type TSavePlatformLanguageLegalTextsViewModelSchemaMap = typeof SavePlatformLanguageLegalTextsViewModelSchemaMap;

// Create discriminated union of all view modes
export const SavePlatformLanguageLegalTextsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SavePlatformLanguageLegalTextsViewModelSchemaMap);
export type TSavePlatformLanguageLegalTextsViewModel = z.infer<typeof SavePlatformLanguageLegalTextsViewModelSchema>;
