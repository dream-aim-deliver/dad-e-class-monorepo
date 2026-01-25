import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListRequiredCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListRequiredCoursesSuccessSchema = ListRequiredCoursesSuccessResponseSchema.shape.data;
export type TListRequiredCoursesSuccess = z.infer<typeof ListRequiredCoursesSuccessSchema>;

// Define view mode schemas
const ListRequiredCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListRequiredCoursesSuccessSchema
);

const ListRequiredCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListRequiredCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListRequiredCoursesViewModelSchemaMap = {
    default: ListRequiredCoursesDefaultViewModelSchema,
    kaboom: ListRequiredCoursesKaboomViewModelSchema,
    notFound: ListRequiredCoursesNotFoundViewModelSchema,
};
export type TListRequiredCoursesViewModelSchemaMap = typeof ListRequiredCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListRequiredCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListRequiredCoursesViewModelSchemaMap);
export type TListRequiredCoursesViewModel = z.infer<typeof ListRequiredCoursesViewModelSchema>;
