import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
// TODO: Replace with actual schema import when backend is ready
// import { RegisterCoachToGroupSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';
import { RegisterCoachToGroupSuccessResponseSchema } from '../usecase-models/register-coach-to-group-usecase-models';

// Extract success data from usecase response
export const RegisterCoachToGroupSuccessSchema = RegisterCoachToGroupSuccessResponseSchema.shape.data;
export type TRegisterCoachToGroupSuccess = z.infer<typeof RegisterCoachToGroupSuccessSchema>;

// Define view mode schemas
const RegisterCoachToGroupDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    RegisterCoachToGroupSuccessSchema
);

const RegisterCoachToGroupKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const RegisterCoachToGroupNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const RegisterCoachToGroupViewModelSchemaMap = {
    default: RegisterCoachToGroupDefaultViewModelSchema,
    kaboom: RegisterCoachToGroupKaboomViewModelSchema,
    notFound: RegisterCoachToGroupNotFoundViewModelSchema,
};
export type TRegisterCoachToGroupViewModelSchemaMap = typeof RegisterCoachToGroupViewModelSchemaMap;

// Create discriminated union of all view modes
export const RegisterCoachToGroupViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RegisterCoachToGroupViewModelSchemaMap);
export type TRegisterCoachToGroupViewModel = z.infer<typeof RegisterCoachToGroupViewModelSchema>;
