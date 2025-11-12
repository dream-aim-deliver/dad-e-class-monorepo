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

export const AddCourseCoachRequestSchema = z.object({
    coachId: z.string(),
    courseSlug: z.string().min(1),
});
export type TAddCourseCoachRequest = z.infer<typeof AddCourseCoachRequestSchema>;

export const AddCourseCoachSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    addedCoach: CoachSchema.nullable(),
}));
export type TAddCourseCoachSuccessResponse = z.infer<typeof AddCourseCoachSuccessResponseSchema>;

const AddCourseCoachUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({
  
});
export type TAddCourseCoachUseCaseErrorResponse = z.infer<typeof AddCourseCoachUseCaseErrorResponseSchema>;

export const AddCourseCoachUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    AddCourseCoachSuccessResponseSchema,
    AddCourseCoachUseCaseErrorResponseSchema,
]);
export type TAddCourseCoachUseCaseResponse = z.infer<typeof AddCourseCoachUseCaseResponseSchema>;