import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory,
} from '@dream-aim-deliver/dad-cats';

// Extract the coach schema from list-coaches-usecase-models for reuse
const CoachSchema = z.object({
    username: z.string(),
    name: z.string(),
    surname: z.string(),
    languages: z.array(z.string()),
    avatarUrl: z.string().nullable(),
    coachingSessionCount: z.number(),
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
    })),
});

export const RemoveCourseCoachRequestSchema = z.object({
    coachId: z.string(),
    courseSlug: z.string(),
});
export type TRemoveCourseCoachRequest = z.infer<typeof RemoveCourseCoachRequestSchema>;

export const RemoveCourseCoachSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    removedCoach: CoachSchema.nullable(),
}));
export type TRemoveCourseCoachSuccessResponse = z.infer<typeof RemoveCourseCoachSuccessResponseSchema>;

const RemoveCourseCoachUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  
});
export type TRemoveCourseCoachUseCaseErrorResponse = z.infer<typeof RemoveCourseCoachUseCaseErrorResponseSchema>;

export const RemoveCourseCoachUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    RemoveCourseCoachSuccessResponseSchema,
    RemoveCourseCoachUseCaseErrorResponseSchema,
]);
export type TRemoveCourseCoachUseCaseResponse = z.infer<typeof RemoveCourseCoachUseCaseResponseSchema>;