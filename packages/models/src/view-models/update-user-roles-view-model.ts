import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { UpdateUserRolesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const UpdateUserRolesSuccessSchema = UpdateUserRolesSuccessResponseSchema.shape.data;
export type TUpdateUserRolesSuccess = z.infer<typeof UpdateUserRolesSuccessSchema>;

// Define view mode schemas
const UpdateUserRolesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    UpdateUserRolesSuccessSchema
);

const UpdateUserRolesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const UpdateUserRolesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const UpdateUserRolesViewModelSchemaMap = {
    default: UpdateUserRolesDefaultViewModelSchema,
    kaboom: UpdateUserRolesKaboomViewModelSchema,
    notFound: UpdateUserRolesNotFoundViewModelSchema,
};
export type TUpdateUserRolesViewModelSchemaMap = typeof UpdateUserRolesViewModelSchemaMap;

// Create discriminated union of all view modes
export const UpdateUserRolesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(UpdateUserRolesViewModelSchemaMap);
export type TUpdateUserRolesViewModel = z.infer<typeof UpdateUserRolesViewModelSchema>;
