import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';
import { DuplicateLessonSuccessResponseSchema } from '@dream-aim-deliver/e-class-cms-rest';

// Extract success data from usecase response
export const DuplicateLessonSuccessSchema = DuplicateLessonSuccessResponseSchema.shape.data;
export type TDuplicateLessonSuccess = z.infer<typeof DuplicateLessonSuccessSchema>;

// Define view mode schemas
const DuplicateLessonDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    DuplicateLessonSuccessSchema
);

const DuplicateLessonKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const DuplicateLessonNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const DuplicateLessonViewModelSchemaMap = {
    default: DuplicateLessonDefaultViewModelSchema,
    kaboom: DuplicateLessonKaboomViewModelSchema,
    notFound: DuplicateLessonNotFoundViewModelSchema,
};
export type TDuplicateLessonViewModelSchemaMap = typeof DuplicateLessonViewModelSchemaMap;

// Create discriminated union of all view modes
export const DuplicateLessonViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(DuplicateLessonViewModelSchemaMap);
export type TDuplicateLessonViewModel = z.infer<typeof DuplicateLessonViewModelSchema>;
