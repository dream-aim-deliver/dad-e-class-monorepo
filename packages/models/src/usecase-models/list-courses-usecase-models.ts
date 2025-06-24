import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const ListCoursesRequestSchema = z.object({});
export type TListCoursesRequest = z.infer<typeof ListCoursesRequestSchema>;

export const ListCoursesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    courses: z.array(z.object({
        id: z.string().or(z.number()),
        title: z.string(),
        slug: z.string(),
        description: z.string(),
        imageUrl: z.string().nullable(),
        averageRating: z.number().nullable(),
        reviewCount: z.number(),
        author: z.object({
            name: z.string(),
            surname: z.string(),
            avatarUrl: z.string().nullable(),
        }),
        topicSlugs: z.array(z.string()),
        language: z.string(),
        coachingSessionCount: z.number().nullable(),
        salesCount: z.number(),
        fullDuration: z.number(), // Is composed of multiple values
        pricing: z.object({
            base: z.number(),
            withCoaching: z.number().nullable(),
            currency: z.string(),
        }),
    }))
}));

export type TListCoursesSuccessResponse = z.infer<typeof ListCoursesSuccessResponseSchema>;

const ListCoursesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCoursesUseCaseErrorResponse = z.infer<typeof ListCoursesUseCaseErrorResponseSchema>;
export const ListCoursesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCoursesSuccessResponseSchema,
    ListCoursesUseCaseErrorResponseSchema,
]);
export type TListCoursesUseCaseResponse = z.infer<typeof ListCoursesUseCaseResponseSchema>;
