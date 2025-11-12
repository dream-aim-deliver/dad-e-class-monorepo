import { z } from 'zod';
import {
    BaseErrorDiscriminatedUnionSchemaFactory,
    BaseStatusDiscriminatedUnionSchemaFactory,
    BaseSuccessSchemaFactory
} from '@dream-aim-deliver/dad-cats';

export const CreateCoachingSessionReviewRequestSchema = z.object({
  sessionId: z.number(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type TCreateCoachingSessionReviewRequest = z.infer<typeof CreateCoachingSessionReviewRequestSchema>;

export const CreateCoachingSessionReviewSuccessResponseSchema = BaseSuccessSchemaFactory(z.object({
}));

export type TCreateCoachingSessionReviewSuccessResponse = z.infer<typeof CreateCoachingSessionReviewSuccessResponseSchema>;

const CreateCoachingSessionReviewUseCaseErrorResponseSchema = BaseErrorDiscriminatedUnionSchemaFactory({});
export type TCreateCoachingSessionReviewUseCaseErrorResponse = z.infer<typeof CreateCoachingSessionReviewUseCaseErrorResponseSchema>;

export const CreateCoachingSessionReviewUseCaseResponseSchema = BaseStatusDiscriminatedUnionSchemaFactory([
  CreateCoachingSessionReviewSuccessResponseSchema,
  CreateCoachingSessionReviewUseCaseErrorResponseSchema,
]);

export type TCreateCoachingSessionReviewUseCaseResponse = z.infer<typeof CreateCoachingSessionReviewUseCaseResponseSchema>;