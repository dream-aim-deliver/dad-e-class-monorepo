import { z } from 'zod'
import { LanguageSchema } from './language'

export const CourseReviewSchema = z.object({

})

/**
 * Schema for a course review.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TCourseReview = z.infer<typeof CourseReviewSchema>