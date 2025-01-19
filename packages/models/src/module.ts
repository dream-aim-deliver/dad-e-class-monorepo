import { z } from 'zod'
import { LanguageSchema } from './language'


export const ModuleSchema = z.object({
    title: z.string(),
})

/**
 * Schema for a module.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 * - `title`: A string representing the title of the course.
 * - `description`: A string providing a brief description of the course.
 * - `duration`: A number indicating the duration of the course.
 */

export type TModule = z.infer<typeof ModuleSchema>