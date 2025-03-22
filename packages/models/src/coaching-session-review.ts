import { z } from 'zod'

export const CoachingSessionReviewSchema = z.object({
    rating: z.number().int().min(0).max(5),
    review: z.string(),
    neededMoreTime: z.boolean(),
    timestamp: z.string().datetime({ offset: true }),
});

/**
 * Schema for coaching session review.
 * 
 * This schema validates the structure of coaching session review objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `rating`: A number representing the rating of the coaching session review. It should be an integer between 0 and 5.
 * - `review`: A string representing the review content.
 * - `neededMoreTime`: A boolean indicating whether the reviewer needed more time.
 * - `timestamp`: A string representing the timestamp of the review. It should contain a valid date and time, with a timezone offset.
 */
export type TCoachingSessionReview = z.infer<typeof CoachingSessionReviewSchema>