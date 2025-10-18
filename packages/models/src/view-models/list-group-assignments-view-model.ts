import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListGroupAssignmentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListGroupAssignmentsSuccessSchema = ListGroupAssignmentsSuccessResponseSchema.shape.data;
export type TListGroupAssignmentsSuccess = z.infer<typeof ListGroupAssignmentsSuccessSchema>;

// Define view mode schemas
const ListGroupAssignmentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListGroupAssignmentsSuccessSchema
);

const ListGroupAssignmentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListGroupAssignmentsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListGroupAssignmentsViewModelSchemaMap = {
    default: ListGroupAssignmentsDefaultViewModelSchema,
    kaboom: ListGroupAssignmentsKaboomViewModelSchema,
    notFound: ListGroupAssignmentsNotFoundViewModelSchema,
};
export type TListGroupAssignmentsViewModelSchemaMap = typeof ListGroupAssignmentsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListGroupAssignmentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListGroupAssignmentsViewModelSchemaMap);
export type TListGroupAssignmentsViewModel = z.infer<typeof ListGroupAssignmentsViewModelSchema>;
