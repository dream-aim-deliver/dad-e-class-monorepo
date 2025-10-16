import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCourseGroupsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCourseGroupsSuccessSchema = ListCourseGroupsSuccessResponseSchema.shape.data;
export type TListCourseGroupsSuccess = z.infer<typeof ListCourseGroupsSuccessSchema>;

// Define view mode schemas
const ListCourseGroupsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCourseGroupsSuccessSchema
);

const ListCourseGroupsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCourseGroupsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCourseGroupsViewModelSchemaMap = {
    default: ListCourseGroupsDefaultViewModelSchema,
    kaboom: ListCourseGroupsKaboomViewModelSchema,
    notFound: ListCourseGroupsNotFoundViewModelSchema,
};
export type TListCourseGroupsViewModelSchemaMap = typeof ListCourseGroupsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCourseGroupsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCourseGroupsViewModelSchemaMap);
export type TListCourseGroupsViewModel = z.infer<typeof ListCourseGroupsViewModelSchema>;
