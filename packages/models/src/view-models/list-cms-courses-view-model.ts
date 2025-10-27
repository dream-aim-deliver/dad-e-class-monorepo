import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCmsCoursesSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCmsCoursesSuccessSchema = ListCmsCoursesSuccessResponseSchema.shape.data;
export type TListCmsCoursesSuccess = z.infer<typeof ListCmsCoursesSuccessSchema>;

// Define view mode schemas
const ListCmsCoursesDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCmsCoursesSuccessSchema
);

const ListCmsCoursesKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCmsCoursesNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCmsCoursesViewModelSchemaMap = {
    default: ListCmsCoursesDefaultViewModelSchema,
    kaboom: ListCmsCoursesKaboomViewModelSchema,
    notFound: ListCmsCoursesNotFoundViewModelSchema,
};
export type TListCmsCoursesViewModelSchemaMap = typeof ListCmsCoursesViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCmsCoursesViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCmsCoursesViewModelSchemaMap);
export type TListCmsCoursesViewModel = z.infer<typeof ListCmsCoursesViewModelSchema>;
