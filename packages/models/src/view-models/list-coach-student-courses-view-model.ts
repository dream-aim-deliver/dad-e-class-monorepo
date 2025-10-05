import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachStudentCoursesResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success schema from discriminated union
const ListCoachStudentCoursesSuccessResponseSchema = ListCoachStudentCoursesResponseSchema.options[0];
export const ListCoachStudentCoursesSuccessSchema = ListCoachStudentCoursesSuccessResponseSchema.shape.data;

export type TListCoachStudentCoursesSuccess = z.infer<typeof ListCoachStudentCoursesSuccessSchema>;

const ListCoachStudentCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("default", ListCoachStudentCoursesSuccessSchema);
const ListCoachStudentCoursesInvalidViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("invalid", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const ListCoachStudentCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("not-found", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));
const ListCoachStudentCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory("kaboom", BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema));

export const ListCoachStudentCoursesViewModelSchemaMap = {
    default: ListCoachStudentCoursesDefaultViewModelSchema,
    invalid: ListCoachStudentCoursesInvalidViewModelSchema,
    "not-found": ListCoachStudentCoursesNotFoundViewModelSchema,
    kaboom: ListCoachStudentCoursesKaboomViewModelSchema,
};
export type TListCoachStudentCoursesViewModelSchemaMap = typeof ListCoachStudentCoursesViewModelSchemaMap;
export const ListCoachStudentCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachStudentCoursesViewModelSchemaMap);
export type TListCoachStudentCoursesViewModel = z.infer<typeof ListCoachStudentCoursesViewModelSchema>;
