import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPlatformSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPlatformSuccessSchema = GetPlatformSuccessResponseSchema.shape.data;
export type TGetPlatformSuccess = z.infer<typeof GetPlatformSuccessSchema>;

// Define view mode schemas
const GetPlatformDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPlatformSuccessSchema
);

const GetPlatformKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPlatformNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPlatformViewModelSchemaMap = {
    default: GetPlatformDefaultViewModelSchema,
    kaboom: GetPlatformKaboomViewModelSchema,
    notFound: GetPlatformNotFoundViewModelSchema,
};
export type TGetPlatformViewModelSchemaMap = typeof GetPlatformViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPlatformViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPlatformViewModelSchemaMap);
export type TGetPlatformViewModel = z.infer<typeof GetPlatformViewModelSchema>;
