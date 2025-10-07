import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveHomePageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveHomePageSuccessSchema = SaveHomePageSuccessResponseSchema.shape.data;
export type TSaveHomePageSuccess = z.infer<typeof SaveHomePageSuccessSchema>;

// Define view mode schemas
const SaveHomePageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveHomePageSuccessSchema
);

const SaveHomePageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveHomePageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveHomePageViewModelSchemaMap = {
    default: SaveHomePageDefaultViewModelSchema,
    kaboom: SaveHomePageKaboomViewModelSchema,
    notFound: SaveHomePageNotFoundViewModelSchema,
};
export type TSaveHomePageViewModelSchemaMap = typeof SaveHomePageViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveHomePageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveHomePageViewModelSchemaMap);
export type TSaveHomePageViewModel = z.infer<typeof SaveHomePageViewModelSchema>;
