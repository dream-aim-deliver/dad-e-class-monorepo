import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveCoachingPageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveCoachingPageSuccessSchema = SaveCoachingPageSuccessResponseSchema.shape.data;
export type TSaveCoachingPageSuccess = z.infer<typeof SaveCoachingPageSuccessSchema>;

// Define view mode schemas
const SaveCoachingPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveCoachingPageSuccessSchema
);

const SaveCoachingPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveCoachingPageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveCoachingPageViewModelSchemaMap = {
    default: SaveCoachingPageDefaultViewModelSchema,
    kaboom: SaveCoachingPageKaboomViewModelSchema,
    notFound: SaveCoachingPageNotFoundViewModelSchema,
};
export type TSaveCoachingPageViewModelSchemaMap = typeof SaveCoachingPageViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveCoachingPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveCoachingPageViewModelSchemaMap);
export type TSaveCoachingPageViewModel = z.infer<typeof SaveCoachingPageViewModelSchema>;
