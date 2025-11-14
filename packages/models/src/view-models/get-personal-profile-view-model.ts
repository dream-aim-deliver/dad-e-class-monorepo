import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetPersonalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetPersonalProfileSuccessSchema = GetPersonalProfileSuccessResponseSchema.shape.data;
export type TGetPersonalProfileSuccess = z.infer<typeof GetPersonalProfileSuccessSchema>;

// Define view mode schemas
const GetPersonalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetPersonalProfileSuccessSchema
);

const GetPersonalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetPersonalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetPersonalProfileViewModelSchemaMap = {
    default: GetPersonalProfileDefaultViewModelSchema,
    kaboom: GetPersonalProfileKaboomViewModelSchema,
    notFound: GetPersonalProfileNotFoundViewModelSchema,
};
export type TGetPersonalProfileViewModelSchemaMap = typeof GetPersonalProfileViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetPersonalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetPersonalProfileViewModelSchemaMap);
export type TGetPersonalProfileViewModel = z.infer<typeof GetPersonalProfileViewModelSchema>;
