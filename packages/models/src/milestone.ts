import { z } from 'zod'
import { LanguageSchema } from './language'


export const MilestoneSchema = z.object({
    title: z.string(),
})

/**
 * Schema for a milestone.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TMilestone = z.infer<typeof MilestoneSchema>