import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUsersSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUsersSuccessSchema = ListUsersSuccessResponseSchema.shape.data;
export type TListUsersSuccess = z.infer<typeof ListUsersSuccessSchema>;

// Define view mode schemas
const ListUsersDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUsersSuccessSchema
);

const ListUsersKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUsersNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUsersViewModelSchemaMap = {
    default: ListUsersDefaultViewModelSchema,
    kaboom: ListUsersKaboomViewModelSchema,
    notFound: ListUsersNotFoundViewModelSchema,
};
export type TListUsersViewModelSchemaMap = typeof ListUsersViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUsersViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUsersViewModelSchemaMap);
export type TListUsersViewModel = z.infer<typeof ListUsersViewModelSchema>;
