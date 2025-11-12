import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { AddCourseCoachSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const AddCourseCoachSuccessSchema = AddCourseCoachSuccessResponseSchema.shape.data;
export type TAddCourseCoachSuccess = z.infer<typeof AddCourseCoachSuccessSchema>;

// Define view mode schemas
const AddCourseCoachDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    AddCourseCoachSuccessSchema
);

const AddCourseCoachKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const AddCourseCoachNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const AddCourseCoachViewModelSchemaMap = {
    default: AddCourseCoachDefaultViewModelSchema,
    kaboom: AddCourseCoachKaboomViewModelSchema,
    notFound: AddCourseCoachNotFoundViewModelSchema,
};
export type TAddCourseCoachViewModelSchemaMap = typeof AddCourseCoachViewModelSchemaMap;

// Create discriminated union of all view modes
export const AddCourseCoachViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(AddCourseCoachViewModelSchemaMap);
export type TAddCourseCoachViewModel = z.infer<typeof AddCourseCoachViewModelSchema>;
