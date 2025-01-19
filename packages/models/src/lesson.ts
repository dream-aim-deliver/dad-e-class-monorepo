import { z } from 'zod'
import { LanguageSchema } from './language'


export const LessonSchema = z.object({
    title: z.string(),
})

/**
 * Schema for a lesson.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TLesson = z.infer<typeof LessonSchema>