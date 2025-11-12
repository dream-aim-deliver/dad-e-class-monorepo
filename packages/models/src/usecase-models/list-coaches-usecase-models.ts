import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';
import { DefaultPaginationSchema } from '../utils/pagination';

export const ListCoachesRequestSchema = DefaultPaginationSchema.extend({
    skillSlugs: z.array(z.string()).optional().nullable(),
    courseSlug: z.string().optional().nullable(),
    pastStudentCoaches: z.boolean().optional().nullable(),
});
export type TListCoachesRequest = z.infer<typeof ListCoachesRequestSchema>;

export const ListCoachesSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    // TODO: might need to add pagination details
    coaches: z.array(z.object({
        username: z.string(),
        name: z.string(),
        surname: z.string(),
        languages: z.array(z.string()),
        coachingSessionCount: z.number(),
        avatarUrl: z.string().nullable(),
        skills: z.array(z.object({
            name: z.string(),
            slug: z.string(),
        })),
        averageRating: z.number().nullable(),
        reviewCount: z.number(),
        bio: z.string(),
        coursesTaught: z.array(z.object({
            title: z.string(),
            slug: z.string(),
            imageUrl: z.string().nullable(),
        }))
    }))
}));

export type TListCoachesSuccessResponse = z.infer<typeof ListCoachesSuccessResponseSchema>;

const ListCoachesUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TListCoachesUseCaseErrorResponse = z.infer<typeof ListCoachesUseCaseErrorResponseSchema>;
export const ListCoachesUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    ListCoachesSuccessResponseSchema,
    ListCoachesUseCaseErrorResponseSchema,
]);
export type TListCoachesUseCaseResponse = z.infer<typeof ListCoachesUseCaseResponseSchema>;