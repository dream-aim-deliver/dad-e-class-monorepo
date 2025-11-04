import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListStudentCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListStudentCoursesSuccessSchema = ListStudentCoursesSuccessResponseSchema.shape.data;
export type TListStudentCoursesSuccess = z.infer<typeof ListStudentCoursesSuccessSchema>;

// Define view mode schemas
const ListStudentCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListStudentCoursesSuccessSchema
);

const ListStudentCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListStudentCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListStudentCoursesViewModelSchemaMap = {
    default: ListStudentCoursesDefaultViewModelSchema,
    kaboom: ListStudentCoursesKaboomViewModelSchema,
    notFound: ListStudentCoursesNotFoundViewModelSchema,
};
export type TListStudentCoursesViewModelSchemaMap = typeof ListStudentCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListStudentCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListStudentCoursesViewModelSchemaMap);
export type TListStudentCoursesViewModel = z.infer<typeof ListStudentCoursesViewModelSchema>;
