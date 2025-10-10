import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveAboutPageSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveAboutPageSuccessSchema = SaveAboutPageSuccessResponseSchema.shape.data;
export type TSaveAboutPageSuccess = z.infer<typeof SaveAboutPageSuccessSchema>;

// Define view mode schemas
const SaveAboutPageDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveAboutPageSuccessSchema
);

const SaveAboutPageKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveAboutPageNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// TODO: Add additional view modes if needed for your use case:
// Example - Loading state:
// const SaveAboutPageLoadingViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
//     "loading",
//     z.object({})
// );
//
// Example - Empty results state:
// const SaveAboutPageEmptyViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
//     "empty",
//     z.object({ message: z.string() })
// );

// Create schema map with all view modes
export const SaveAboutPageViewModelSchemaMap = {
    default: SaveAboutPageDefaultViewModelSchema,
    kaboom: SaveAboutPageKaboomViewModelSchema,
    notFound: SaveAboutPageNotFoundViewModelSchema,
    // loading: SaveAboutPageLoadingViewModelSchema,
    // empty: SaveAboutPageEmptyViewModelSchema,
};
export type TSaveAboutPageViewModelSchemaMap = typeof SaveAboutPageViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveAboutPageViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveAboutPageViewModelSchemaMap);
export type TSaveAboutPageViewModel = z.infer<typeof SaveAboutPageViewModelSchema>;
