import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUserRolesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUserRolesSuccessSchema = ListUserRolesSuccessResponseSchema.shape.data;
export type TListUserRolesSuccess = z.infer<typeof ListUserRolesSuccessSchema>;

// Define view mode schemas
const ListUserRolesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUserRolesSuccessSchema
);

const ListUserRolesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUserRolesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUserRolesViewModelSchemaMap = {
    default: ListUserRolesDefaultViewModelSchema,
    kaboom: ListUserRolesKaboomViewModelSchema,
    notFound: ListUserRolesNotFoundViewModelSchema,
};
export type TListUserRolesViewModelSchemaMap = typeof ListUserRolesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUserRolesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUserRolesViewModelSchemaMap);
export type TListUserRolesViewModel = z.infer<typeof ListUserRolesViewModelSchema>;
