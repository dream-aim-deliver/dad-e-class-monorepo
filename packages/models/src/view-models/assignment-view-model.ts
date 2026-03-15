import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetAssignmentSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetAssignmentSuccessSchema = GetAssignmentSuccessResponseSchema.shape.data;
export type TGetAssignmentSuccess = z.infer<typeof GetAssignmentSuccessSchema>;

// Define view mode schemas
const GetAssignmentDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetAssignmentSuccessSchema
);

const GetAssignmentKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetAssignmentNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetAssignmentViewModelSchemaMap = {
    default: GetAssignmentDefaultViewModelSchema,
    kaboom: GetAssignmentKaboomViewModelSchema,
    notFound: GetAssignmentNotFoundViewModelSchema,
};
export type TGetAssignmentViewModelSchemaMap = typeof GetAssignmentViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetAssignmentViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetAssignmentViewModelSchemaMap);
export type TGetAssignmentViewModel = z.infer<typeof GetAssignmentViewModelSchema>;

// Backwards compatibility aliases
export const AssignmentSuccessSchema = GetAssignmentSuccessSchema;
export type TAssignmentSuccess = TGetAssignmentSuccess;
export const AssignmentViewModelSchemaMap = GetAssignmentViewModelSchemaMap;
export type TAssignmentViewModelSchemaMap = TGetAssignmentViewModelSchemaMap;
export const AssignmentViewModelSchema = GetAssignmentViewModelSchema;
export type TAssignmentViewModel = TGetAssignmentViewModel;
