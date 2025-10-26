import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SavePlatformFooterSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SavePlatformFooterSuccessSchema = SavePlatformFooterSuccessResponseSchema.shape.data;
export type TSavePlatformFooterSuccess = z.infer<typeof SavePlatformFooterSuccessSchema>;

// Define view mode schemas
const SavePlatformFooterDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SavePlatformFooterSuccessSchema
);

const SavePlatformFooterKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SavePlatformFooterNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SavePlatformFooterViewModelSchemaMap = {
    default: SavePlatformFooterDefaultViewModelSchema,
    kaboom: SavePlatformFooterKaboomViewModelSchema,
    notFound: SavePlatformFooterNotFoundViewModelSchema,
};
export type TSavePlatformFooterViewModelSchemaMap = typeof SavePlatformFooterViewModelSchemaMap;

// Create discriminated union of all view modes
export const SavePlatformFooterViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SavePlatformFooterViewModelSchemaMap);
export type TSavePlatformFooterViewModel = z.infer<typeof SavePlatformFooterViewModelSchema>;
