import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { PublishCourseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const PublishCourseSuccessSchema = PublishCourseSuccessResponseSchema.shape.data;
export type TPublishCourseSuccess = z.infer<typeof PublishCourseSuccessSchema>;

// Define view mode schemas
const PublishCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    PublishCourseSuccessSchema
);

const PublishCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const PublishCourseNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const PublishCourseViewModelSchemaMap = {
    default: PublishCourseDefaultViewModelSchema,
    kaboom: PublishCourseKaboomViewModelSchema,
    notFound: PublishCourseNotFoundViewModelSchema,
};
export type TPublishCourseViewModelSchemaMap = typeof PublishCourseViewModelSchemaMap;

// Create discriminated union of all view modes
export const PublishCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(PublishCourseViewModelSchemaMap);
export type TPublishCourseViewModel = z.infer<typeof PublishCourseViewModelSchema>;
