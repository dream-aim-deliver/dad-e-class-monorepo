import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListUserCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListUserCoursesSuccessSchema = ListUserCoursesSuccessResponseSchema.shape.data;
export type TListUserCoursesSuccess = z.infer<typeof ListUserCoursesSuccessSchema>;

// Define view mode schemas
const ListUserCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListUserCoursesSuccessSchema
);

const ListUserCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListUserCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListUserCoursesViewModelSchemaMap = {
    default: ListUserCoursesDefaultViewModelSchema,
    kaboom: ListUserCoursesKaboomViewModelSchema,
    notFound: ListUserCoursesNotFoundViewModelSchema,
};
export type TListUserCoursesViewModelSchemaMap = typeof ListUserCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListUserCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListUserCoursesViewModelSchemaMap);
export type TListUserCoursesViewModel = z.infer<typeof ListUserCoursesViewModelSchema>;
