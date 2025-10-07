import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetCoachProfileAccessSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetCoachProfileAccessSuccessSchema = GetCoachProfileAccessSuccessResponseSchema.shape.data;
export type TGetCoachProfileAccessSuccess = z.infer<typeof GetCoachProfileAccessSuccessSchema>;

// Define view mode schemas
const GetCoachProfileAccessDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetCoachProfileAccessSuccessSchema
);

const GetCoachProfileAccessKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetCoachProfileAccessNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetCoachProfileAccessViewModelSchemaMap = {
    default: GetCoachProfileAccessDefaultViewModelSchema,
    kaboom: GetCoachProfileAccessKaboomViewModelSchema,
    notFound: GetCoachProfileAccessNotFoundViewModelSchema,
};
export type TGetCoachProfileAccessViewModelSchemaMap = typeof GetCoachProfileAccessViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetCoachProfileAccessViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetCoachProfileAccessViewModelSchemaMap);
export type TGetCoachProfileAccessViewModel = z.infer<typeof GetCoachProfileAccessViewModelSchema>;
