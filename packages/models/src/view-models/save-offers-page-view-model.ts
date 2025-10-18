import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveOffersPageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveOffersPageSuccessSchema = SaveOffersPageSuccessResponseSchema.shape.data;
export type TSaveOffersPageSuccess = z.infer<typeof SaveOffersPageSuccessSchema>;

// Define view mode schemas
const SaveOffersPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveOffersPageSuccessSchema
);

const SaveOffersPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveOffersPageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveOffersPageViewModelSchemaMap = {
    default: SaveOffersPageDefaultViewModelSchema,
    kaboom: SaveOffersPageKaboomViewModelSchema,
    notFound: SaveOffersPageNotFoundViewModelSchema,
};
export type TSaveOffersPageViewModelSchemaMap = typeof SaveOffersPageViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveOffersPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveOffersPageViewModelSchemaMap);
export type TSaveOffersPageViewModel = z.infer<typeof SaveOffersPageViewModelSchema>;
