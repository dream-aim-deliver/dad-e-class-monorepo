import { z } from 'zod'


export const TopicSchema = z.object({
    name: z.string(),
    url: z.string(),
})

/**
 * Schema for a topic. These are called "topic" from the perspective of a course or package, and "skills" from the perspective of a profile.
 *
 * This schema validates the structure of course metadata objects, ensuring they contain
 * the required properties with the correct types.
 *
 * Properties:
 * - `name`: A string representing the name of the topic.
 */

export type TTopic = z.infer<typeof TopicSchema>
