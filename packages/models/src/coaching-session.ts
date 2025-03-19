import { z } from 'zod'

export const CoachingSessionSchema = z.object({
    startTime: z.string().datetime({ offset: true }),
    endTime: z.string().datetime({ offset: true }),
    rating: z.number().int().min(0).max(5),
});

/**
 * Schema for coaching session.
 * 
 * This schema validates the structure of coaching session objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `startTime`: A string representing the start time of the coaching session.
 * - `endTime`: A string representing the end time of the coaching session.
 * - `rating`: A number representing the rating of the coaching session. It should be an integer between 0 and 5.
 * 
 */
export type TCoachingSession = z.infer<typeof CoachingSessionSchema>
