import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const CreateCoachingSessionReviewRequestSchema = z.object({
    coachingSessionId: z.number(),
    rating: z.number().int().min(1).max(5),
    notes: z.string().optional().nullable(),
    neededMoreTime: z.boolean(),
});
export type TCreateCoachingSessionReviewRequest = z.infer<typeof CreateCoachingSessionReviewRequestSchema>;

export const CoachingSessionReviewSchema = z.object({
    id: z.number(),
    rating: z.number().int().min(1).max(5),
    notes: z.string().optional().nullable(),
    neededMoreTime: z.boolean(),
});

export type TCoachingSessionReview = z.infer<typeof CoachingSessionReviewSchema>;

export const CreateCoachingSessionReviewSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
    review: CoachingSessionReviewSchema,
}));

export type TCreateCoachingSessionReviewSuccessResponse = z.infer<typeof CreateCoachingSessionReviewSuccessResponseSchema>;

const CreateCoachingSessionReviewUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TCreateCoachingSessionReviewUseCaseErrorResponse = z.infer<typeof CreateCoachingSessionReviewUseCaseErrorResponseSchema>;

export const CreateCoachingSessionReviewUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
    CreateCoachingSessionReviewSuccessResponseSchema,
    CreateCoachingSessionReviewUseCaseErrorResponseSchema,
]);

export type TCreateCoachingSessionReviewUseCaseResponse = z.infer<typeof CreateCoachingSessionReviewUseCaseResponseSchema>;