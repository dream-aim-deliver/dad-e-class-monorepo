import { z } from 'zod'

export const CourseMetedataSchema = z.object({
    title: z.string(),
    description: z.string(),
    duration: z.number(),
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

export type TCourseMetedata = z.infer<typeof CourseMetedataSchema>