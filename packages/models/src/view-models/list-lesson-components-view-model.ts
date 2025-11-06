import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListLessonComponentsSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListLessonComponentsSuccessSchema = ListLessonComponentsSuccessResponseSchema.shape.data;
export type TListLessonComponentsSuccess = z.infer<typeof ListLessonComponentsSuccessSchema>;

// Define view mode schemas
const ListLessonComponentsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListLessonComponentsSuccessSchema
);

const ListLessonComponentsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListLessonComponentsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListLessonComponentsViewModelSchemaMap = {
    default: ListLessonComponentsDefaultViewModelSchema,
    kaboom: ListLessonComponentsKaboomViewModelSchema,
    notFound: ListLessonComponentsNotFoundViewModelSchema,
};
export type TListLessonComponentsViewModelSchemaMap = typeof ListLessonComponentsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListLessonComponentsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListLessonComponentsViewModelSchemaMap);
export type TListLessonComponentsViewModel = z.infer<typeof ListLessonComponentsViewModelSchema>;
