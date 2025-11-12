import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCoursesSuccessSchema = ListCoursesSuccessResponseSchema.shape.data;
export type TListCoursesSuccess = z.infer<typeof ListCoursesSuccessSchema>;

// Define view mode schemas
const ListCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCoursesSuccessSchema
);

const ListCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCoursesViewModelSchemaMap = {
    default: ListCoursesDefaultViewModelSchema,
    kaboom: ListCoursesKaboomViewModelSchema,
    notFound: ListCoursesNotFoundViewModelSchema,
};
export type TListCoursesViewModelSchemaMap = typeof ListCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCoursesViewModelSchemaMap);
export type TListCoursesViewModel = z.infer<typeof ListCoursesViewModelSchema>;
