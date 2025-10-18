import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListGroupMembersSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListGroupMembersSuccessSchema = ListGroupMembersSuccessResponseSchema.shape.data;
export type TListGroupMembersSuccess = z.infer<typeof ListGroupMembersSuccessSchema>;

// Define view mode schemas
const ListGroupMembersDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListGroupMembersSuccessSchema
);

const ListGroupMembersKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListGroupMembersNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListGroupMembersViewModelSchemaMap = {
    default: ListGroupMembersDefaultViewModelSchema,
    kaboom: ListGroupMembersKaboomViewModelSchema,
    notFound: ListGroupMembersNotFoundViewModelSchema,
};
export type TListGroupMembersViewModelSchemaMap = typeof ListGroupMembersViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListGroupMembersViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListGroupMembersViewModelSchemaMap);
export type TListGroupMembersViewModel = z.infer<typeof ListGroupMembersViewModelSchema>;
