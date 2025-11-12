import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { CreateCourseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const CreateCourseSuccessSchema = CreateCourseSuccessResponseSchema.shape.data;
export type TCreateCourseSuccess = z.infer<typeof CreateCourseSuccessSchema>;

// Define view mode schemas
const CreateCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    CreateCourseSuccessSchema
);

const CreateCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const CreateCourseNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const CreateCourseViewModelSchemaMap = {
    default: CreateCourseDefaultViewModelSchema,
    kaboom: CreateCourseKaboomViewModelSchema,
    notFound: CreateCourseNotFoundViewModelSchema,
};
export type TCreateCourseViewModelSchemaMap = typeof CreateCourseViewModelSchemaMap;

// Create discriminated union of all view modes
export const CreateCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(CreateCourseViewModelSchemaMap);
export type TCreateCourseViewModel = z.infer<typeof CreateCourseViewModelSchema>;
