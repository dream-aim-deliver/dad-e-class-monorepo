import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ArchiveCourseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ArchiveCourseSuccessSchema = ArchiveCourseSuccessResponseSchema.shape.data;
export type TArchiveCourseSuccess = z.infer<typeof ArchiveCourseSuccessSchema>;

// Define view mode schemas
const ArchiveCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ArchiveCourseSuccessSchema
);

const ArchiveCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ArchiveCourseNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ArchiveCourseViewModelSchemaMap = {
    default: ArchiveCourseDefaultViewModelSchema,
    kaboom: ArchiveCourseKaboomViewModelSchema,
    notFound: ArchiveCourseNotFoundViewModelSchema,
};
export type TArchiveCourseViewModelSchemaMap = typeof ArchiveCourseViewModelSchemaMap;

// Create discriminated union of all view modes
export const ArchiveCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ArchiveCourseViewModelSchemaMap);
export type TArchiveCourseViewModel = z.infer<typeof ArchiveCourseViewModelSchema>;
