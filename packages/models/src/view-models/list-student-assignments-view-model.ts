import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListStudentAssignmentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListStudentAssignmentsSuccessSchema = ListStudentAssignmentsSuccessResponseSchema.shape.data;
export type TListStudentAssignmentsSuccess = z.infer<typeof ListStudentAssignmentsSuccessSchema>;

// Define view mode schemas
const ListStudentAssignmentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListStudentAssignmentsSuccessSchema
);

const ListStudentAssignmentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListStudentAssignmentsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListStudentAssignmentsViewModelSchemaMap = {
    default: ListStudentAssignmentsDefaultViewModelSchema,
    kaboom: ListStudentAssignmentsKaboomViewModelSchema,
    notFound: ListStudentAssignmentsNotFoundViewModelSchema,
};
export type TListStudentAssignmentsViewModelSchemaMap = typeof ListStudentAssignmentsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListStudentAssignmentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListStudentAssignmentsViewModelSchemaMap);
export type TListStudentAssignmentsViewModel = z.infer<typeof ListStudentAssignmentsViewModelSchema>;
