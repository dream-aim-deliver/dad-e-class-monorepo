import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { SaveCourseAdminDetailsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const SaveCourseAdminDetailsSuccessSchema = SaveCourseAdminDetailsSuccessResponseSchema.shape.data;
export type TSaveCourseAdminDetailsSuccess = z.infer<typeof SaveCourseAdminDetailsSuccessSchema>;

// Define view mode schemas
const SaveCourseAdminDetailsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    SaveCourseAdminDetailsSuccessSchema
);

const SaveCourseAdminDetailsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const SaveCourseAdminDetailsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const SaveCourseAdminDetailsViewModelSchemaMap = {
    default: SaveCourseAdminDetailsDefaultViewModelSchema,
    kaboom: SaveCourseAdminDetailsKaboomViewModelSchema,
    notFound: SaveCourseAdminDetailsNotFoundViewModelSchema,
};
export type TSaveCourseAdminDetailsViewModelSchemaMap = typeof SaveCourseAdminDetailsViewModelSchemaMap;

// Create discriminated union of all view modes
export const SaveCourseAdminDetailsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(SaveCourseAdminDetailsViewModelSchemaMap);
export type TSaveCourseAdminDetailsViewModel = z.infer<typeof SaveCourseAdminDetailsViewModelSchema>;
