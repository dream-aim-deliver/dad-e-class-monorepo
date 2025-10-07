import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoachCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoachCoursesSuccessSchema = ListCoachCoursesSuccessResponseSchema.shape.data;
export type TListCoachCoursesSuccess = z.infer<typeof ListCoachCoursesSuccessSchema>;

// Define view mode schemas
const ListCoachCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoachCoursesSuccessSchema
);

const ListCoachCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoachCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoachCoursesViewModelSchemaMap = {
    default: ListCoachCoursesDefaultViewModelSchema,
    kaboom: ListCoachCoursesKaboomViewModelSchema,
    notFound: ListCoachCoursesNotFoundViewModelSchema,
};
export type TListCoachCoursesViewModelSchemaMap = typeof ListCoachCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoachCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoachCoursesViewModelSchemaMap);
export type TListCoachCoursesViewModel = z.infer<typeof ListCoachCoursesViewModelSchema>;
