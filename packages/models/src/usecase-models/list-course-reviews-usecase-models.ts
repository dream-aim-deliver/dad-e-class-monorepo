import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';
import { CourseReviewSchema } from './common';

export const ListCourseReviewsRequestSchema = DefaultPaginationSchema.extend({
    courseSlug: z.string(),
});
export type TListCourseReviewsRequest = z.infer<typeof ListCourseReviewsRequestSchema>;

export const ListCourseReviewsSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    reviews: z.array(
        CourseReviewSchema
    )
}));
export type TListCourseReviewsSuccessResponse = z.infer<typeof ListCourseReviewsSuccessResponseSchema>;

const ListCourseReviewsUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCourseReviewsUseCaseErrorResponse = z.infer<typeof ListCourseReviewsUseCaseErrorResponseSchema>;

export const ListCourseReviewsUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCourseReviewsSuccessResponseSchema,
    ListCourseReviewsUseCaseErrorResponseSchema,
]);
export type TListCourseReviewsUseCaseResponse = z.infer<typeof ListCourseReviewsUseCaseResponseSchema>;