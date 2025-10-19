import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { ListPlatformCoursesShortSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const ListPlatformCoursesShortSuccessSchema = ListPlatformCoursesShortSuccessResponseSchema.shape.data;
export type TListPlatformCoursesShortSuccess = z.infer<typeof ListPlatformCoursesShortSuccessSchema>;

// Define view mode schemas
const ListPlatformCoursesShortDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListPlatformCoursesShortSuccessSchema
);

const ListPlatformCoursesShortKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListPlatformCoursesShortNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListPlatformCoursesShortViewModelSchemaMap = {
    default: ListPlatformCoursesShortDefaultViewModelSchema,
    kaboom: ListPlatformCoursesShortKaboomViewModelSchema,
    notFound: ListPlatformCoursesShortNotFoundViewModelSchema,
};
export type TListPlatformCoursesShortViewModelSchemaMap = typeof ListPlatformCoursesShortViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListPlatformCoursesShortViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListPlatformCoursesShortViewModelSchemaMap);
export type TListPlatformCoursesShortViewModel = z.infer<typeof ListPlatformCoursesShortViewModelSchema>;
