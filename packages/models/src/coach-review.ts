import { z } from 'zod'

export const CoachReviewSchema = z.object({
    rating: z.number().int().min(0).max(5),
    review: z.string(),
    neededMoreTime: z.boolean(),
    timestamp: z.string().datetime({ offset: true }),
});

/**
 * Schema for coach review.
 * 
 * This schema validates the structure of coach review objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `rating`: A number representing the rating of the coach review. It should be an integer between 0 and 5.
 * - `review`: A string representing the review content.
 * - `neededMoreTime`: A boolean indicating whether the reviewer needed more time.
 * - `timestamp`: A string representing the timestamp of the review. It should contain a valid date and time, with a timezone offset.
 */
export type TCoachReview = z.infer<typeof CoachReviewSchema>