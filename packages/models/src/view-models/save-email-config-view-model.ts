import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveEmailConfigSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveEmailConfigSuccessSchema = SaveEmailConfigSuccessResponseSchema.shape.data;
export type TSaveEmailConfigSuccess = z.infer<typeof SaveEmailConfigSuccessSchema>;

// Define view mode schemas
const SaveEmailConfigDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveEmailConfigSuccessSchema
);

const SaveEmailConfigKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveEmailConfigNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveEmailConfigViewModelSchemaMap = {
    default: SaveEmailConfigDefaultViewModelSchema,
    kaboom: SaveEmailConfigKaboomViewModelSchema,
    notFound: SaveEmailConfigNotFoundViewModelSchema,
};
export type TSaveEmailConfigViewModelSchemaMap = typeof SaveEmailConfigViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveEmailConfigViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveEmailConfigViewModelSchemaMap);
export type TSaveEmailConfigViewModel = z.infer<typeof SaveEmailConfigViewModelSchema>;
