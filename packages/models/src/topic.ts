import { z } from 'zod'


export const TopicSchema = z.object({
    title: z.string(),
})

/**
 * Schema for a topic.
 * 
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 * 
 * Properties:
 */

export type TTopic = z.infer<typeof TopicSchema>