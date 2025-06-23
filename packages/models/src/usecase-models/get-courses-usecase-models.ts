import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

export const GetCoursesRequestSchema = z.object({});
export type TGetCoursesRequest = z.infer<typeof GetCoursesRequestSchema>;

export const GetCoursesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
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
        topicIds: z.array(z.string().or(z.number())),
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

export type TGetCoursesSuccessResponse = z.infer<typeof GetCoursesSuccessResponseSchema>;

const GetCoursesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TGetCoursesUseCaseErrorResponse = z.infer<typeof GetCoursesUseCaseErrorResponseSchema>;
export const GetCoursesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    GetCoursesSuccessResponseSchema,
    GetCoursesUseCaseErrorResponseSchema,
]);
export type TGetCoursesUseCaseResponse = z.infer<typeof GetCoursesUseCaseResponseSchema>;
