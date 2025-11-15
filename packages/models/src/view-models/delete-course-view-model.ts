import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DeleteCourseSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const DeleteCourseSuccessSchema = DeleteCourseSuccessResponseSchema.shape.data;
export type TDeleteCourseSuccess = z.infer<typeof DeleteCourseSuccessSchema>;

// Define view mode schemas
const DeleteCourseDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    DeleteCourseSuccessSchema
);

const DeleteCourseKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const DeleteCourseNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const DeleteCourseViewModelSchemaMap = {
    default: DeleteCourseDefaultViewModelSchema,
    kaboom: DeleteCourseKaboomViewModelSchema,
    notFound: DeleteCourseNotFoundViewModelSchema,
};
export type TDeleteCourseViewModelSchemaMap = typeof DeleteCourseViewModelSchemaMap;

// Create discriminated union of all view modes
export const DeleteCourseViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DeleteCourseViewModelSchemaMap);
export type TDeleteCourseViewModel = z.infer<typeof DeleteCourseViewModelSchema>;
