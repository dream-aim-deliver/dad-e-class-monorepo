import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DuplicateCourseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const DuplicateCourseSuccessSchema = DuplicateCourseSuccessResponseSchema.shape.data;
export type TDuplicateCourseSuccess = z.infer<typeof DuplicateCourseSuccessSchema>;

// Define view mode schemas
const DuplicateCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    DuplicateCourseSuccessSchema
);

const DuplicateCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const DuplicateCourseNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const DuplicateCourseViewModelSchemaMap = {
    default: DuplicateCourseDefaultViewModelSchema,
    kaboom: DuplicateCourseKaboomViewModelSchema,
    notFound: DuplicateCourseNotFoundViewModelSchema,
};
export type TDuplicateCourseViewModelSchemaMap = typeof DuplicateCourseViewModelSchemaMap;

// Create discriminated union of all view modes
export const DuplicateCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DuplicateCourseViewModelSchemaMap);
export type TDuplicateCourseViewModel = z.infer<typeof DuplicateCourseViewModelSchema>;
