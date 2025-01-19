import { z } from 'zod'
import { LanguageSchema } from './language'


export const LessonComponentSchema = z.object({
})

/**
 * Schema for a lesson component.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TLessonComponent = z.infer<typeof LessonComponentSchema>