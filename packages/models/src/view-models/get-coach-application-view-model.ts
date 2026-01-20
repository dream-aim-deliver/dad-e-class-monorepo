import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachApplicationSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetCoachApplicationSuccessSchema = GetCoachApplicationSuccessResponseSchema.shape.data;
export type TGetCoachApplicationSuccess = z.infer<typeof GetCoachApplicationSuccessSchema>;

// Define view mode schemas
const GetCoachApplicationDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCoachApplicationSuccessSchema
);

const GetCoachApplicationKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCoachApplicationNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCoachApplicationViewModelSchemaMap = {
    default: GetCoachApplicationDefaultViewModelSchema,
    kaboom: GetCoachApplicationKaboomViewModelSchema,
    notFound: GetCoachApplicationNotFoundViewModelSchema,
};
export type TGetCoachApplicationViewModelSchemaMap = typeof GetCoachApplicationViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCoachApplicationViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCoachApplicationViewModelSchemaMap);
export type TGetCoachApplicationViewModel = z.infer<typeof GetCoachApplicationViewModelSchema>;
