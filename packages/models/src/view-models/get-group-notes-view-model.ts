import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { GetGroupNotesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const GetGroupNotesSuccessSchema = GetGroupNotesSuccessResponseSchema.shape.data;
export type TGetGroupNotesSuccess = z.infer<typeof GetGroupNotesSuccessSchema>;

// Define view mode schemas
const GetGroupNotesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    GetGroupNotesSuccessSchema
);

const GetGroupNotesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const GetGroupNotesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const GetGroupNotesViewModelSchemaMap = {
    default: GetGroupNotesDefaultViewModelSchema,
    kaboom: GetGroupNotesKaboomViewModelSchema,
    notFound: GetGroupNotesNotFoundViewModelSchema,
};
export type TGetGroupNotesViewModelSchemaMap = typeof GetGroupNotesViewModelSchemaMap;

// Create discriminated union of all view modes
export const GetGroupNotesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(GetGroupNotesViewModelSchemaMap);
export type TGetGroupNotesViewModel = z.infer<typeof GetGroupNotesViewModelSchema>;
