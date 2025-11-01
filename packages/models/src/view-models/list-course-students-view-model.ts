import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListCourseStudentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListCourseStudentsSuccessSchema = ListCourseStudentsSuccessResponseSchema.shape.data;
export type TListCourseStudentsSuccess = z.infer<typeof ListCourseStudentsSuccessSchema>;

// Define view mode schemas
const ListCourseStudentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCourseStudentsSuccessSchema
);

const ListCourseStudentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCourseStudentsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCourseStudentsViewModelSchemaMap = {
    default: ListCourseStudentsDefaultViewModelSchema,
    kaboom: ListCourseStudentsKaboomViewModelSchema,
    notFound: ListCourseStudentsNotFoundViewModelSchema,
};
export type TListCourseStudentsViewModelSchemaMap = typeof ListCourseStudentsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCourseStudentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCourseStudentsViewModelSchemaMap);
export type TListCourseStudentsViewModel = z.infer<typeof ListCourseStudentsViewModelSchema>;
