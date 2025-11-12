import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { RemoveCourseCoachSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const RemoveCourseCoachSuccessSchema = RemoveCourseCoachSuccessResponseSchema.shape.data;
export type TRemoveCourseCoachSuccess = z.infer<typeof RemoveCourseCoachSuccessSchema>;

// Define view mode schemas
const RemoveCourseCoachDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    RemoveCourseCoachSuccessSchema
);

const RemoveCourseCoachKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const RemoveCourseCoachNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const RemoveCourseCoachViewModelSchemaMap = {
    default: RemoveCourseCoachDefaultViewModelSchema,
    kaboom: RemoveCourseCoachKaboomViewModelSchema,
    notFound: RemoveCourseCoachNotFoundViewModelSchema,
};
export type TRemoveCourseCoachViewModelSchemaMap = typeof RemoveCourseCoachViewModelSchemaMap;

// Create discriminated union of all view modes
export const RemoveCourseCoachViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(RemoveCourseCoachViewModelSchemaMap);
export type TRemoveCourseCoachViewModel = z.infer<typeof RemoveCourseCoachViewModelSchema>;
