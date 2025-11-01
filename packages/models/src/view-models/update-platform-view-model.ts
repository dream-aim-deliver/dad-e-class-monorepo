import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdatePlatformSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const UpdatePlatformSuccessSchema = UpdatePlatformSuccessResponseSchema.shape.data;
export type TUpdatePlatformSuccess = z.infer<typeof UpdatePlatformSuccessSchema>;

// Define view mode schemas
const UpdatePlatformDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    UpdatePlatformSuccessSchema
);

const UpdatePlatformKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const UpdatePlatformNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const UpdatePlatformViewModelSchemaMap = {
    default: UpdatePlatformDefaultViewModelSchema,
    kaboom: UpdatePlatformKaboomViewModelSchema,
    notFound: UpdatePlatformNotFoundViewModelSchema,
};
export type TUpdatePlatformViewModelSchemaMap = typeof UpdatePlatformViewModelSchemaMap;

// Create discriminated union of all view modes
export const UpdatePlatformViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdatePlatformViewModelSchemaMap);
export type TUpdatePlatformViewModel = z.infer<typeof UpdatePlatformViewModelSchema>;
