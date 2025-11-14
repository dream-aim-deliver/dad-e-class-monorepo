import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetProfessionalProfileSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetProfessionalProfileSuccessSchema = GetProfessionalProfileSuccessResponseSchema.shape.data;
export type TGetProfessionalProfileSuccess = z.infer<typeof GetProfessionalProfileSuccessSchema>;

// Define view mode schemas
const GetProfessionalProfileDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetProfessionalProfileSuccessSchema
);

const GetProfessionalProfileKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetProfessionalProfileNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetProfessionalProfileViewModelSchemaMap = {
    default: GetProfessionalProfileDefaultViewModelSchema,
    kaboom: GetProfessionalProfileKaboomViewModelSchema,
    notFound: GetProfessionalProfileNotFoundViewModelSchema,
};
export type TGetProfessionalProfileViewModelSchemaMap = typeof GetProfessionalProfileViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetProfessionalProfileViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetProfessionalProfileViewModelSchemaMap);
export type TGetProfessionalProfileViewModel = z.infer<typeof GetProfessionalProfileViewModelSchema>;
