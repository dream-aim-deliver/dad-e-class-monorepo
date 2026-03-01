import { z } from 'zod'
import { LanguageSchema } from './language'


export const CourseDurationSchema = z.object({
    video: z.number(),  // in seconds, duration of video content
    coaching: z.number(),  // in minutes, duration of coaching sessions
    selfStudy: z.number(),  // in minutes, duration of self-study content
})
export type TCourseDuration = z.infer<typeof CourseDurationSchema>

export const CoursePricingSchema = z.object({
    fullPrice: z.number(),
    partialPrice: z.number(),
    currency: z.string(),
    coachingSessionsTotal: z.number().optional().nullable(),
    savingsWithCoachings: z.number().optional().nullable(),
    savings: z.number().optional().nullable(),
})
export type TCoursePricing = z.infer<typeof CoursePricingSchema>


export const CourseMetadataSchema = z.object({
    title: z.string(),
    description: z.string(),
    duration: CourseDurationSchema,
    pricing: CoursePricingSchema,
    imageUrl: z.string(),
    rating: z.number(),
    author: z.object({
        name: z.string(),
        image: z.string().optional(),
    }),
    language: LanguageSchema,
})

/**
 * Schema for course metadata.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `title`: A string representing the title of the course.
 * - `description`: A string providing a brief description of the course.
 * - `duration`: A number indicating the duration of the course.
 */

export type TCourseMetadata = z.infer<typeof CourseMetadataSchema>