import { z } from 'zod';
import {
    BaseDiscriminatedViewModeSchemaFactory,
    BaseErrorContextSchema,
    BaseErrorDataSchema,
    BaseErrorDataSchemaFactory,
    BaseViewModelDiscriminatedUnionSchemaFactory
} from '@dream-aim-deliver/dad-cats';

// Define the UI-friendly transformed data schema
const ReviewStudentSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    avatarFile: z.object({
        id: z.string(),
        name: z.string(),
        downloadUrl: z.string(),
        size: z.number(),
        category: z.literal('image')
    }).nullable()
});

const ReviewSchema = z.object({
    id: z.union([z.string(), z.number()]),
    rating: z.number(),
    createdAt: z.string(),
    comment: z.string(),
    student: ReviewStudentSchema
});

// Define the success schema for transformed UI data
export const ListCourseReviewsSuccessSchema = z.object({
    reviews: z.array(ReviewSchema)
});
export type TListCourseReviewsSuccess = z.infer<typeof ListCourseReviewsSuccessSchema>;

// Define view mode schemas
const ListCourseReviewsDefaultViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "default",
    ListCourseReviewsSuccessSchema
);

const ListCourseReviewsKaboomViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "kaboom",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

const ListCourseReviewsNotFoundViewModelSchema = BaseDiscriminatedViewModeSchemaFactory(
    "not-found",
    BaseErrorDataSchemaFactory(BaseErrorDataSchema, BaseErrorContextSchema)
);

// Create schema map with all view modes
export const ListCourseReviewsViewModelSchemaMap = {
    default: ListCourseReviewsDefaultViewModelSchema,
    kaboom: ListCourseReviewsKaboomViewModelSchema,
    notFound: ListCourseReviewsNotFoundViewModelSchema,
};
export type TListCourseReviewsViewModelSchemaMap = typeof ListCourseReviewsViewModelSchemaMap;

// Create discriminated union of all view modes
export const ListCourseReviewsViewModelSchema = BaseViewModelDiscriminatedUnionSchemaFactory(ListCourseReviewsViewModelSchemaMap);
export type TListCourseReviewsViewModel = z.infer<typeof ListCourseReviewsViewModelSchema>;
